"use client";

import { useState } from "react";

export default function InvoiceForm() {
  const [inputInvoice, setInputInvoice] = useState("");
  const [error, setError] = useState("");

  async function handleFind(e: React.FormEvent) {
      e.preventDefault();
      setError("");
  
      try {
        const res = await fetch(`/api/invoice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId: inputInvoice }),
          credentials: "include",
        });
  
        const result = await res.json();
  
        if (!res.ok) {
          setError(result.message || "Transaction not found");
          return;
        }
  
        const { redirectUrl, token } = result.data;
  
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
  
        if (token && (window as any).snap?.pay) {
          (window as any).snap.pay(token, {
            onSuccess: () => {
              window.location.reload();
            },
            onPending: () => window.alert("Payment pending"),
            onError: () => window.alert("Payment failed"),
            onClose: () => window.alert("Payment popup closed"),
          });
          return;
        }
  
        setError("No payment link or token available for this transaction");
      } catch (error) {
        console.error(error);
        setError("Failed to find transaction. Try again later.");
      }
    }
  return (
    <form
      onSubmit={handleFind}
      className="p-8 bg-white border border-gray-300 shadow rounded-xl"
    >
      <h3 className="mb-4 lg:text-xl text-lg font-medium text-gray-500">
        Cari detail pembelian kamu disini
      </h3>
      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

      <input
        className="w-full px-3 py-2 mb-3 rounded-lg focus:outline-none ring ring-gray-200 focus:ring-gray-400 placeholder:text-sm"
        type="text"
        placeholder="Masukkan nomor transaksi kamu (Contoh: INV-XXXXXXXXXX"
        value={inputInvoice}
        onChange={(e) => setInputInvoice(e.target.value)}
      />
      <button
        type="submit"
        className="w-full py-2 font-medium text-gray-100 bg-green-600 rounded-full cursor-pointer"
      >
        Cari Transaksi
      </button>
    </form>
  );
}
