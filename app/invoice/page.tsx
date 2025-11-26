"use client";
import React, { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/formatDate";

export default function InvoicePage() {
  const [inputInvoice, setInputInvoice] = useState("");
  const [error, setError] = useState("");
  const [recentPayments, setRecentPayments] = useState([]);

  async function handleFind(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoice`, {
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
          onClose: () => window.alert("Payment popup closed")
        });
        return;
      }

      setError("No payment link or token available for this transaction")
    } catch (error) {
      console.error(error);
      setError("Failed to find transaction. Try again later.")
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoice`, {
          credentials: "include",
        });
        const result = await res.json();
        if (!mounted) return;
        if (result.success) setRecentPayments(result.data);
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      mounted = false;
    }
  }, []);

  return (
    <div className="flex items-center justify-center mx-auto py-20">
      <div className="flex flex-col items-center justify-center space-y-10">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-wide text-center text-gray-800">Cek Transaksi Kamu dengan Mudah dan Cepat</h1>
          <h2 className="mb-4 text-xl font-medium tracking-wide text-center text-gray-500">Lihat detail pembelian kamu menggunakan nomor Transaksi.</h2>
        </div>
        <form onSubmit={handleFind} className="p-8 bg-white border border-gray-300 shadow w-xl rounded-xl">
          <h3 className="mb-4 text-lg font-medium text-gray-500 tracking">Cari detail pembelian kamu disini</h3>
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

          <input
            className="w-full px-3 py-2 mb-3 rounded-lg focus:outline-none ring ring-gray-200 focus:ring-gray-400 placeholder:text-sm"
            type="text"
            placeholder="Masukkan nomor transaksi kamu (Contoh: INV-XXXXXXXX-XXX"
            value={inputInvoice}
            onChange={(e) => setInputInvoice(e.target.value)}
          />
          <button type="submit" className="w-full py-2 font-medium text-gray-100 bg-green-600 rounded-full cursor-pointer">
            Cari Transaksi
          </button>
        </form>
        <div className="mt-5">
          <div className="bg-white rounded-xl px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[800px] border-collapse text-left">
                <thead className="text-gray-500 text-xs sm:text-sm">
                  <tr>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Tanggal
                    </th>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Nomor Transaksi
                    </th>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Nama
                    </th>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Harga
                    </th>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        {p.transactionId}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        {p.customerName}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        Rp{p.totalAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        <span
                          className={`px-2 py-1 capitalize rounded-full font-medium text-xs ${p.status === "paid"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                            }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
