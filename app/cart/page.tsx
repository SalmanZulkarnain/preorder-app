"use client";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import { useRef, useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
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

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!name.trim() || !phoneNumber.trim()) {
        setMessage("Nama dan nomor telepon wajib diisi");
        setMessageType("error");
        return;
      }

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
        setMessage(resultOrder.message);
        setMessageType("success");
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
              });
            document.body.appendChild(script);
          } else {
            window.snap.pay(resultMidtrans.token, callbacks);
          }
        }
      } else {
        setMessage(resultOrder.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Gagal membuat pesanan. Silakan coba lagi.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const callbacks = {
    onSuccess: function () {
      setMessage("Pembayaran berhasil!");
      setMessageType("success");
      fetchCarts();
    },
    onPending: function () {
      setMessage("Pembayaran pending. Silakan selesaikan pembayaran Anda.");
      setMessageType("info");
    },
    onError: function () {
      setMessage("Pembayaran gagal. Silakan coba lagi.");
      setMessageType("error");
    },
    onClose: function () {
      setMessage("Anda menutup popup pembayaran.");
      setMessageType("warning");
    },
  };

  if (!carts || carts.length === 0)
    return (
      <p className="p-20 text-xl text-center text-gray-600 lg:col-span-2">
        Tidak ada produk di keranjang saat ini.
      </p>
    );

  if (loading)
    return (
      <div className="text-xl text-center text-gray-600 lg:col-span-2">
        Loading...
      </div>
    );

  return (
    <div className="grid items-start max-w-6xl grid-cols-1 gap-6 mx-auto lg:grid-cols-3">
      {/* CART LIST */}
      <div className="grid grid-cols-1 gap-2 lg:gap-6 lg:col-span-2">
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
        <form onSubmit={handleOrder}>
          {message && (
            <div
              className={`p-3 rounded-md mb-4 ${messageType === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-700"
                }`}
            >
              {message}
            </div>
          )}
          <div className="mb-4 space-y-2">
            <div>
              <label htmlFor="customerName" className="text-gray-500 text-[12px]">
                Customer Name *
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
            </div>
            <div>
              <label
                htmlFor="customerPhone"
                className="text-gray-500 text-[12px]"
              >
                Customer Phone *
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


