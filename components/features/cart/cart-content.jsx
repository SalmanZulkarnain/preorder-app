"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

export default function CartPageContent() {
  const {
    carts,
    totalItems,
    totalAmount,
    deleteCart,
    updateQuantity,
  } = useCart();
  
  // state checkout
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Reset pesan sebelumnya

    try {
      // Validation
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

        console.log(resultMidtrans);
        console.log("Snap token: ", resultMidtrans.token);
        console.log("Redirect URL: ", resultMidtrans.redirect_url);

        if (resultMidtrans.token) {
          // ✅ Panggil Snap popup
          window.snap.pay(resultMidtrans.token, {
            onSuccess: function (result) {
              console.log("SUCCESS:", result);
              setMessage("Pembayaran berhasil!");
              setMessageType("success");
              fetchCarts();
            },
            onPending: function (result) {
              console.log("PENDING:", result);
              setMessage(
                "Pembayaran pending. Silakan selesaikan pembayaran Anda."
              );
              setMessageType("info");
            },
            onError: function (result) {
              console.error("ERROR:", result);
              setMessage("Pembayaran gagal. Silakan coba lagi.");
              setMessageType("error");
            },
            onClose: function () {
              console.log("Popup ditutup");
              setMessage("Anda menutup popup pembayaran.");
              setMessageType("warning");
            },
          });
        }
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Gagal membuat pesanan. Silakan coba lagi.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center text-gray-600 text-xl p-20">Loading...</div>
    );
  }

  // Empty cart
  if (!carts || carts.length === 0) {
    return (
      <div className="text-center text-gray-600 text-xl p-20">
        Keranjang kosong nih...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-8">
        <section className="space-y-6 col-span-2 ">
          {carts.map((cart) => (
            <div
              key={cart.id}
              className="bg-white rounded hover:outline hover:outline-green-600 duration-100 hover:shadow-sm flex gap-2"
            >
              <div className="sm:size-40 size-20 rounded relative p-2 sm:p-4 self-center">
                <Image
                  src={cart.product.image}
                  alt={cart.product.name}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 sm:gap-0 justify-between p-4 ">
                <div className="flex flex-wrap justify-between sm:flex-col space-y-2 space-x-2">
                  <h4 className="font-medium">{cart.product.name}</h4>
                  <h4 className="font-bold">
                    {cart.product.price.toLocaleString("id-ID")}
                  </h4>
                </div>
                <div className="flex justify-end items-center">
                  <>
                    {/* hapus */}
                    <button
                      onClick={() => deleteCart(cart.id)}
                      className="p-3 cursor-pointer rounded-full"
                    >
                      <Trash2 className="size-4 text-red-700" />
                    </button>
                    {/* container minus, jumlah, dan plus */}
                    <div className="sm:h-10 h-8 flex items-center outline outline-gray-500 rounded-full">
                      {/* minus */}
                      <button
                        onClick={() =>
                          updateQuantity(cart.id, "decrement")
                        }
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
                        onClick={() =>
                          updateQuantity(cart.id, "increment")
                        }
                        className="p-3 cursor-pointer"
                      >
                        <Plus className="size-4 text-green-600" />
                      </button>
                    </div>
                  </>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="p-4 bg-white">
          <h3 className="font-bold mb-2">Informasi Pembeli</h3>
          <form onSubmit={handleOrder}>
            {message && (
              <div
                className={`p-3 rounded-md mb-4 ${
                  messageType === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
            <div className="mb-4 space-y-2">
              <div>
                <label
                  htmlFor="customerName"
                  className="text-gray-500 text-[12px]"
                >
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                />
              </div>
            </div>

            <hr className="text-gray-300 p-0 mb-4 flex" />

            <h3 className="font-bold mb-2">Ringkasan Belanja</h3>
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-sm text-gray-500">
                Total ({totalItems} item)
              </h5>
              <h5 className="font-bold">
                Rp{totalAmount.toLocaleString("id-ID")}
              </h5>
            </div>

            <hr className="text-gray-300 p-0 mb-4 flex" />

            <button
              type="submit"
              className="bg-green-600 w-full rounded-md text-sm py-3 text-white font-medium cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
