"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function Checkout() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const { carts, fetchCarts, totalAmount } = useCart();

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

  const callbacks = {
    onSuccess: function (result) {
      console.log("SUCCESS:", result);
      setMessage("Pembayaran berhasil!");
      setMessageType("success");
      fetchCarts();
    },
    onPending: function (result) {
      console.log("PENDING:", result);
      setMessage("Pembayaran pending. Silakan selesaikan pembayaran Anda.");
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
  };

  return (
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
  );
}
