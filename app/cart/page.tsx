"use client";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import { useRef, useState } from "react";
import { Trash2, Minus, Plus, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { toast, Toaster } from "sonner";

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks: any) => void;
    };
  }
}

export default function CartPage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameErrorMessage, setNameErrorMessage] = useState(null);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const { carts, setCarts, fetchCarts, totalAmount } = useCart();

  const debounceTimers = useRef({});
  const quantityRefs = useRef({});

  const handleUpdateQuantity = async (cartId, operation) => {
    const originalCarts = [...carts];

    setCarts((prev) =>
      prev
        .map((cart) => {
          if (cart.id === cartId) {
            const newQuantity = operation === "increment" ? cart.quantity + 1 : Math.max(0, cart.quantity - 1);

            quantityRefs.current[cartId] = newQuantity;

            return { ...cart, quantity: newQuantity }
          }

          return cart;
        }).filter((cart) => cart.quantity > 0)
    );

    if (debounceTimers.current[cartId]) {
      clearTimeout(debounceTimers.current[cartId]);
    }

    debounceTimers.current[cartId] = setTimeout(async () => {
      try {
        const finalQuantity = quantityRefs.current[cartId];
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: finalQuantity }),
        });

        if (!res.ok) throw new Error("Update failed");

        const result = await res.json();

        if (result.message === "Cart deleted successfully") {
          setCarts(prev => prev.filter(cart => cart.id !== cartId))
        }
      } catch (error) {
        setCarts(originalCarts);
      }
    }, 400);
  }

  const handleDelete = async (cartId) => {
    const originalCarts = [...carts];
    setCarts((prev) => prev.filter((cart) => cart.id !== cartId));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch (error) {
      setCarts(originalCarts);
    }
  };

  const setPaymentFeedback = (status, message) => {
    setPaymentStatus(status);
    setPaymentMessage(message);
  };

  const handleDismissPaymentStatus = () => {
    setPaymentStatus(null);
    setPaymentMessage("");
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    handleDismissPaymentStatus();

    const phoneNumberValidation = !phoneNumber.trim();
    const numberValidation = !/^[0-9]+$/.test(phoneNumber);
    if (phoneNumberValidation) {
      setPhoneNumberErrorMessage(phoneNumberValidation ? 'Nomor wajib diisi' : '');
    } else if (numberValidation) {
      setPhoneNumberErrorMessage(numberValidation ? 'Nomor harus berupa angka' : '');
    }

    const nameValidation = !name.trim();
    setNameErrorMessage(nameValidation ? 'Nama wajib diisi' : '');
    if (phoneNumberValidation || numberValidation || nameValidation) return;

    setLoading(true);


    try {
      const resOrder = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
        credentials: "include",
      });

      const resultOrder = await resOrder.json();

      if (resultOrder.success) {
        toast.success(resultOrder.message);
        // Reset form
        setName("");
        setPhoneNumber("");
        console.log(resultOrder.data.order.id);

        const resMidtrans = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/midtrans`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId: resultOrder.data.order.id }),
          }
        );

        const resultMidtrans = await resMidtrans.json();

        if (resultMidtrans.token) {
          if (!window.snap) {
            const script = document.createElement("script");
            script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
            script.setAttribute(
              "data-client-key",
              process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
            ),
              (script.onload = () => {
                window.snap.pay(resultMidtrans.token, callbacks);
                console.log(resultMidtrans)
              });
            document.body.appendChild(script);
          } else {
            window.snap.pay(resultMidtrans.token, callbacks);
            console.log(resultMidtrans)
          }
        } else {
          setPaymentFeedback("error", "Token pembayaran tidak tersedia. Silakan coba lagi.");
        }
      } else {
        toast.error(resultOrder.message);
        setPaymentFeedback("error", resultOrder.message || "Gagal membuat pesanan.");
      }
    } catch (error) {
      toast.error("Gagal membuat pesanan. Silakan coba lagi.");
      setPaymentFeedback("error", "Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const callbacks = {
    onSuccess: function () {
      toast.success("Pembayaran berhasil!");
      fetchCarts();
      setPaymentFeedback("success", "Pembayaran berhasil! Kami akan segera memproses pesanan Anda.");
    },
    onPending: function () {
      toast.info("Pembayaran pending. Silakan selesaikan pembayaran Anda.");
      setPaymentFeedback("pending", "Pembayaran Anda masih menunggu. Silakan selesaikan prosesnya.");
    },
    onError: function () {
      toast.error("Pembayaran gagal. Silakan coba lagi.");
      setPaymentFeedback("error", "Pembayaran gagal. Silakan coba lagi.");
    },
    onClose: function () {
      toast.warning("Anda menutup popup pembayaran.");
      setPaymentFeedback("warning", "Anda menutup jendela pembayaran. Lanjutkan pembayaran untuk menyelesaikan pesanan.");
    },
  };

  if (loading)
    return (
      <div className="text-xl text-center text-gray-600 lg:col-span-2">
        Loading...
      </div>
    );

  const statusStyles = {
    success: { wrapper: "bg-green-50 border-green-200 text-green-900", Icon: CheckCircle2 },
    pending: { wrapper: "bg-yellow-50 border-yellow-200 text-yellow-900", Icon: AlertTriangle },
    warning: { wrapper: "bg-yellow-50 border-yellow-200 text-yellow-900", Icon: AlertTriangle },
    error: { wrapper: "bg-red-50 border-red-200 text-red-900", Icon: AlertTriangle },
  };

  const ActiveStatusIcon = paymentStatus ? statusStyles[paymentStatus]?.Icon || AlertTriangle : null;

  return (
    <div className="grid items-start max-w-6xl grid-cols-1 gap-6 mx-auto lg:grid-cols-3">
      {paymentStatus && (
        <div className={`lg:col-span-3 flex items-start gap-3 p-4 border rounded-sm ${statusStyles[paymentStatus]?.wrapper || "bg-gray-50 border-gray-200 text-gray-900"}`}>
          {ActiveStatusIcon && <ActiveStatusIcon className="mt-1 size-5" />}
          <div className="flex-1">
            <p className="text-sm font-semibold capitalize">{paymentStatus}</p>
            <p className="text-sm">{paymentMessage}</p>
          </div>
          <button
            type="button"
            aria-label="Tutup notifikasi status pembayaran"
            onClick={handleDismissPaymentStatus}
            className="text-sm text-current hover:opacity-70"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {/* CART LIST */}
      <div className="grid grid-cols-1 gap-2 lg:gap-6 lg:col-span-2">
        {!carts || carts.length === 0 && (
          <p className="p-20 text-xl text-center text-gray-600 lg:col-span-2">
            Tidak ada produk di keranjang saat ini.
          </p>
        )}
        {carts.map(cart => (
          <div key={cart.id} className="flex flex-row gap-2 p-4 duration-100 bg-white border border-gray-200 rounded-sm cursor-pointer hover:outline hover:outline-green-600 hover:shadow-sm sm:p-0">
            <div className="relative rounded sm:size-40 size-20 sm:p-4">
              <Image
                src={cart.product.image}
                alt={cart.product.name}
                width={256}
                height={256}
                className="object-cover w-full h-full rounded"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 gap-2 sm:p-4 sm:gap-0">
              <div className="flex flex-wrap justify-between space-x-2 space-y-2 sm:flex-col">
                <h4 className="text-sm font-medium sm:text-base">{cart.product.name}</h4>
                <h4 className="font-semibold">
                  {cart.product.price.toLocaleString("id-ID")}
                </h4>
              </div>
              <div className="flex items-center justify-end"><>
                {/* hapus */}
                <button
                  onClick={() => handleDelete(cart.id)}
                  className="p-3 cursor-pointer rounded-full"
                >
                  <Trash2 className="size-4 text-red-700" />
                </button>
                {/* container minus, jumlah, dan plus */}
                <div className="sm:h-10 h-8 flex items-center outline outline-gray-500 rounded-full">
                  {/* minus */}
                  <button
                    onClick={() => handleUpdateQuantity(cart.id, "decrement")}
                    className="p-3 cursor-pointer"
                  >
                    <Minus className="size-4 text-green-600" />
                  </button>
                  <input
                    type="text"
                    className="text-center sm:w-8 w-5"
                    readOnly
                    value={cart.quantity}
                  />
                  {/* plus */}
                  <button
                    onClick={() => handleUpdateQuantity(cart.id, "increment")}
                    className="p-3 cursor-pointer"
                  >
                    <Plus className="size-4 text-green-600" />
                  </button>
                </div>
              </></div>
            </div>
          </div>
        ))}
      </div>

      {/* CHECKOUT */}
      <div className="col-span-1 p-4 bg-white border border-gray-200 rounded-sm sm:p-6">
        <h3 className="mb-2 font-bold">Informasi Pembeli</h3>
        <Toaster duration={2000} richColors position="top-center"></Toaster>
        <form onSubmit={handleOrder}>
          <div className="mb-4 space-y-2">
            <div>
              <label htmlFor="customerName" className="text-gray-500 text-[12px]">
                Customer Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="customerName"
                className="outline px-2 py-1.5 rounded w-full border border-gray-300 focus:border-green-500 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
              {nameErrorMessage && (
                <span className={`text-xs text-red-700`}>{nameErrorMessage}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="customerPhone"
                className="text-gray-500 text-[12px]"
              >
                Customer Phone <span className="text-red-700">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="customerPhone"
                className="outline px-2 py-1.5 rounded w-full border border-gray-300 focus:border-green-500 focus:outline-none"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 08123456789"
              />
              {phoneNumberErrorMessage && (
                <span className={`text-xs text-red-700`}>{phoneNumberErrorMessage}</span>
              )}
            </div>
          </div>

          <hr className="flex p-0 mb-4 text-gray-300" />

          <h3 className="mb-2 font-bold">Ringkasan Belanja</h3>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm text-gray-500">Total ({carts.length} item)</h5>
            <h5 className="font-bold">Rp{totalAmount.toLocaleString("id-ID")}</h5>
          </div>

          <hr className="flex p-0 mb-4 text-gray-300" />

          <button
            type="submit"
            className="w-full py-3 text-sm font-medium text-white transition-colors bg-green-600 rounded-md cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Pesan"}
          </button>
        </form>
      </div>
    </div>
  );
}


