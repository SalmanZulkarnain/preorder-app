"use client";

import { FilterIcon, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/ButtonExport";

export default function ProductFilter({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [name, setName] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (name.trim() !== "") {
        onFilter({ name });
      } else {
        onFilter({}); // kalau input dikosongin, balikin semua produk
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [name, onFilter]);

  const handleApply = () => {
    onFilter({
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    });
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full sm:w-70 outline outline-gray-300 focus:outline-2 rounded-lg pr-4 py-3 text-sm pl-12 text-gray-500 font-medium"
          placeholder="Search..."
        />
      </div>
      <div className="relative inline-block" ref={dropdownRef}>
        <Button
          icon={FilterIcon}
          className="relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          Filter
        </Button>
        {isOpen && (
          <div className="absolute bg-white w-60 p-4 top-15 right-0 shadow-xl space-y-2">
            <div className="space-y-2 w-full">
              <label className="text-sm" htmlFor="minPrice">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                id="minPrice"
                placeholder="0"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500 w-full"
              />
            </div>
            <div className="space-y-2 w-full">
              <label className="text-sm" htmlFor="maxPrice">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                id="maxPrice"
                placeholder="1000000"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500 w-full"
              />
            </div>
            <button
              onClick={handleApply}
              className="bg-green-600 text-white w-full py-2 rounded-md mt-2"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </>
  );
}
