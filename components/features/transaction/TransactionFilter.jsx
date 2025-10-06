"use client";

import { FilterIcon, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/ButtonExport";

export default function TransactionFilter({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    transactionId: "",
    status: "",
    paymentType: "",
    date: "",
  });

  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter(filters);
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters.transactionId]); // Only debounce search

  const handleInputChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onFilter(filters); // Apply all filters together
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilter = {
      transactionId: "",
      status: "",
      paymentType: "",
      date: "",
    };
    setFilters(resetFilter);
    onFilter({});
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative flex-1 sm:flex-auto">
        <span className="absolute top-1/2 left-4 -translate-y-1/2">
          <Search className="w-5 text-gray-500" />
        </span>
        <input
          type="text"
          value={filters.transactionId}
          onChange={(e) => handleInputChange("transactionId", e.target.value)}
          className="w-full sm:w-70 outline outline-gray-300 focus:outline-2 rounded-lg pr-4 py-3 text-sm pl-12 text-gray-500 font-medium"
          placeholder="Search by Transaction ID..."
        />
      </div>
      <div className="relative inline-block" ref={dropdownRef}>
        <Button
          icon={FilterIcon}
          className="relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          Filter
          {(filters.status || filters.paymentType || filters.date) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>

        {isOpen && (
          <div className="absolute bg-white w-60 p-4 top-15 right-0 shadow-xl space-y-2 border rounded-lg">
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium" htmlFor="status">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                id="status"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500 w-full"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2 w-full">
              <label className="text-sm font-medium" htmlFor="paymentType">
                Payment Type
              </label>
              <select
                value={filters.paymentType}
                onChange={(e) =>
                  handleInputChange("paymentType", e.target.value)
                }
                id="paymentType"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500 w-full"
              >
                <option value="">All</option>
                <option value="qris">QRIS</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="echannel">E-Channel</option>
              </select>
            </div>

            <div className="space-y-2 w-full">
              <label className="text-sm font-medium" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                id="date"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500 w-full"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleReset}
                className="border border-gray-300 text-gray-700 px-3 py-2 rounded-md flex-1 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="bg-green-600 text-white px-3 py-2 rounded-md flex-1 hover:bg-green-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
