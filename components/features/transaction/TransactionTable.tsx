"use client";

import Table from "@/components/ui/Table";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { formatDate } from "@/lib/utils/formatDate";
import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { PaymentWithOrder } from "@/types/payment";
import TransactionDetail from "./TransactionDetail";

type Pagination = {
  limit: number;
  totalCount: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

type InitialPayments = {
  data?: PaymentWithOrder[];
  pagination?: Pagination | null;
};

type TransactionTableProps = {
  filters: Record<string, string>;
  initialPayments?: InitialPayments;
};

export default function TransactionTable({ filters, initialPayments }: TransactionTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithOrder | null>(null);
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentWithOrder[]>(initialPayments?.data || []);
  const [pagination, setPagination] = useState<Pagination | null>(
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
        `/api/payment?${params}`
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

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
    fetchPayments(newPage);
  };

  const toggleSection = (section: string) => {
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
                className="hover:bg-gray-50 transition cursor-pointer text-xs sm:text-sm"
                onClick={() => {
                  setSelectedPayment(p);
                  setOpen(true);
                }}
              >
                <td className="border-b border-gray-200 px-5 py-4">
                  {p.transactionTime ? formatDate(p.transactionTime) : "-"}
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
                      p.order.status === "PAID"
                        ? "text-green-600 bg-green-100"
                        : p.order.status === "PENDING"
                        ? "text-blue-600 bg-blue-100"
                        : p.order.status === "EXPIRED"
                        ? "text-red-600 bg-red-100"
                        : "text-yellow-600 bg-yellow-100"
                    }`}
                  >
                    {p.order.status}
                  </span>
                </td>
                <td className="border-b border-gray-200 px-5 py-4">
                  Rp{p.grossAmount.toLocaleString("id-ID")}
                </td>
                <td className="border-b border-gray-200 px-5 py-4">
                  {p.order.customerName}
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
                {Math.min(currentPage * pagination.limit, pagination.totalCount)}{" "}
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

                <div className="flex gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      return (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
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

     <TransactionDetail onClose={() => setOpen(false)} selectedPayment={selectedPayment} open={open} openSection={openSection} toggleSection={toggleSection}/>
    </>
  );
}
