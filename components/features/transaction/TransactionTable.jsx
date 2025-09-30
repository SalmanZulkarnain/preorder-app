"use client";

import Table from "@/components/ui/Table";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { formatDate } from "@/lib/utils/formatDate";
import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function TransactionTable({ filters, initialPayments }) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [payments, setPayments] = useState(initialPayments?.data || []);
  const [pagination, setPagination] = useState(
    initialPayments?.pagination || null
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isInitialMount = useRef(true);

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: "10",
      }).toString();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment?${params}`
      );

      if (!res.ok) throw new Error("Failed to fetch payment");

      const result = await res.json();
      setPayments(result.data);
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching payment: ", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const hasFilters = Object.values(filters).some((value) => value !== "");

    if (hasFilters) {
      fetchPayments(1);
    } else {
      setPayments(initialPayments?.data || []);
      setPagination(initialPayments?.pagination || null);
      setCurrentPage(1);
    }
  }, [filters]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
    fetchPayments(newPage);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      {loading ? (
        <TableSkeleton rows={8} columns={7} />
      ) : (
        <>
          <Table
            columns={[
              "Date & Time",
              "Transaction ID",
              "Payment Type",
              "Status",
              "Amount",
              "Customer",
              "Phone",
            ]}
            data={payments}
            renderRow={(p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 transition cursor-pointer text-xs sm:text-sm" // Smaller text on mobile
                onClick={() => {
                  setSelectedPayment(p);
                  setOpen(true);
                }}
              >
                <td className="border-b border-gray-200 px-5 py-4">
                  {formatDate(p.transactionTime)}
                </td>
                <td className="border-b border-gray-200 px-5 py-4">
                  {p.transactionId}
                </td>
                <td className="border-b border-gray-200 px-5 py-4 uppercase">
                  {p.paymentType}
                </td>
                <td className="border-b border-gray-200 px-5 py-4">
                  <span
                    className={`font-medium px-3 py-1 rounded-full ${
                      p.order.status === "paid"
                        ? "text-green-600 bg-green-100"
                        : p.order.status === "pending" 
                        ? "text-yellow-600 bg-yellow-100"
                        : p.order.status === "expired" 
                        ? "text-red-600 bg-red-100" 
                        : "text-orange-600 bg-orange-100"
                    }`}
                  >
                    {p.order.status}
                  </span>
                </td>
                <td className="border-b border-gray-200 px-5 py-4">
                  Rp{p.grossAmount.toLocaleString("id-ID")}
                </td>
                <td className="border-b border-gray-200 px-5 py-4">
                  {p.order.customer.name}
                </td>
                <td className="border-b border-gray-200 px-5 py-4">
                  {p.order.customer.phoneNumber}
                </td>
              </tr>
            )}
          />
          {pagination && pagination.totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  currentPage * pagination.limit,
                  pagination.totalCount
                )}{" "}
                of {pagination.totalCount} results
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-3 py-2 rounded-lg border transition ${
                    pagination.hasPrevPage
                      ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter((pageNum) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      );
                    })
                    .map((pageNum, index, array) => (
                      <div key={pageNum} className="flex items-center gap-1">
                        {index > 0 && array[index - 1] !== pageNum - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg transition ${
                            currentPage === pageNum
                              ? "bg-green-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-3 py-2 rounded-lg border transition ${
                    pagination.hasNextPage
                      ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 m-0"
          onClick={() => setOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 px-4 sm:px-6 py-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } ${
          open ? "w-full sm:w-96 md:w-150" : "" // Full width on mobile, narrower on larger screens
        }`}
      >
        {/* Exit Button */}
        <button
          className="text-gray-500 hover:text-gray-800 w-full text-right text-xl mb-4"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        {selectedPayment && (
          <>
            {/* Order ID */}
            <div className="flex flex-col gap-2 mb-4">
              <h3 className="text-green-600 text-sm font-medium">Payment</h3>
              <p className="text-gray-600 font-medium text-sm">
                Order ID {selectedPayment.transactionId}
              </p>
              <h3 className="font-bold text-xl sm:text-2xl">
                Rp{selectedPayment.grossAmount.toLocaleString("id-ID")}
              </h3>
            </div>

            {/* Status */}
            <div className="space-y-4 mb-4">
              <span className="font-bold block mb-2">Status</span>
              <hr className="mb-3 border-gray-300" />
              <h3
                className={`rounded p-3 text-sm ${
                  selectedPayment.order.status === "paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                Transaction status: {selectedPayment.order.status}
              </h3>
            </div>

            {/* Payment details */}
            <div className="mb-4">
              <span className="font-bold block mb-2">Payment Details</span>
              <hr className="mb-3 border-gray-300" />
              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-bold">Transaction ID</h5>
                  <span className="block">
                    {selectedPayment.midtransTransactionId}
                  </span>
                </div>
                <div>
                  <h5 className="font-bold">Payment Type</h5>
                  <span className="uppercase block">
                    {selectedPayment.paymentType}
                  </span>
                </div>
                <div>
                  <h5 className="font-bold">Created On</h5>
                  <span className="block">
                    {formatDate(selectedPayment.transactionTime)}
                  </span>
                </div>
                <div>
                  <h5 className="font-bold">Expiry Time</h5>
                  <span className="block">
                    {formatDate(selectedPayment.expiryTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order details */}
            <div className="mb-4">
              <span className="font-bold block mb-2">Order Details</span>
              <hr className="mb-3 border-gray-300" />
              <div className="space-y-4">
                <div>
                  <button
                    onClick={() => toggleSection("customer")}
                    className="w-full flex justify-between items-centers font-medium"
                  >
                    Customer details
                    <span>{openSection === "customer" ? "-" : "+"}</span>
                  </button>
                  {openSection === "customer" && (
                    <div className="pt-4">
                      <div className="p-4 bg-gray-100 rounded">
                        <p>
                          <strong>Name:</strong>{" "}
                          {selectedPayment.order.customer.name}
                        </p>
                        <p>
                          <strong>Mobile number:</strong>{" "}
                          {selectedPayment.order.customer.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => toggleSection("product")}
                    className="w-full flex justify-between items-centers font-medium"
                  >
                    Product details
                    <span>{openSection === "product" ? "-" : "+"}</span>
                  </button>
                  {openSection === "product" && (
                    <div className="pt-4">
                      <table className="table-auto w-full text-left">
                        <thead>
                          <tr>
                            <th className="border border-gray-200 p-3 text-sm">
                              PRODUCT ID
                            </th>
                            <th className="border border-gray-200 p-3 text-sm">
                              PRODUCT NAME
                            </th>
                            <th className="border border-gray-200 p-3 text-sm">
                              QUANTITY
                            </th>
                            <th className="border border-gray-200 p-3 text-sm">
                              PRICE
                            </th>
                            <th className="border border-gray-200 p-3 text-sm">
                              SUBTOTAL
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPayment.order.orderItems.map((item) => (
                            <tr key={item.id}>
                              <td className="border p-3 border-gray-200">
                                {item.product.id}
                              </td>
                              <td className="border p-3 border-gray-200">
                                {item.product.name}
                              </td>
                              <td className="border p-3 border-gray-200">
                                {item.quantity}
                              </td>
                              <td className="border p-3 border-gray-200">
                                Rp{item.priceAtOrder.toLocaleString("id-ID")}
                              </td>
                              <td className="border p-3 border-gray-200">
                                Rp
                                {(
                                  item.priceAtOrder * item.quantity
                                ).toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
