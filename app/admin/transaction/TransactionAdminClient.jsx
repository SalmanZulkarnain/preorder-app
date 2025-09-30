"use client";

import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import TransactionFilter from "@/components/features/transaction/TransactionFilter";
import TransactionTable from "@/components/features/transaction/TransactionTable";
import { useCallback, useState } from "react";
import Button from "@/components/ui/ButtonExport";

export default function TransactionAdminClient({ initialPayments }) {
  const [filters, setFilters] = useState({});

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/export?${params}`);

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); 
    } catch (error) {
      console.error('Export error: ', error);
      alert('Failed to export data');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold">Transactions</h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm"
                href="/admin/dashboard"
              >
                Home
                <ChevronRight className="w-4" />
              </Link>
            </li>
            <li className="text-sm text-gray-800">Transactions</li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-xl overflow-hidden sm:overflow-visible shadow-xs border border-gray-200">
        <div className="px-5 py-4 flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-b-gray-200">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              Transactions
            </h3>
            <p className="text-sm text-gray-500">
              Your most recent transactions list.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Handle Filter */}
            <TransactionFilter onFilter={handleFilter} />

            {/* Export Button */}
            <Button onClick={handleExport} icon={Download}>
              Export
            </Button>
          </div>
        </div>
        <TransactionTable initialPayments={initialPayments} filters={filters} />
      </div>
    </div>
  );
}
