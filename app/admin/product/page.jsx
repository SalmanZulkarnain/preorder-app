"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronRight, Plus, Download, Ellipsis } from "lucide-react";
import Table from "@/components/ui/Table";
import ProductFilter from "@/components/features/product/ProductFilter";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import Button from "@/components/ui/ButtonExport";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(false);

  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleExport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/export`);
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `products.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url); 
    } catch (error) {
      console.error('Export error: ', error);
      alert('Failed to export data');
    }
  }

  const fetchProducts = async (filters, page = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: "5",
      }).toString();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product?${params}`
      );
      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setProducts(result.data);
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products: ", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (loadingId === productId) return;

    try {
      setLoadingId(productId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        await fetchProducts();
      } else {
        toast.error("Gagal hapus produk");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold">Products</h2>
        <Toaster duration={1000} richColors position="top-center" />
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
            <li className="text-sm text-gray-800">Products</li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-xl overflow-hidden sm:overflow-visible shadow-xs border border-gray-200">
        <div className="px-5 py-4 flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-b-gray-200">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              Product List
            </h3>
            <p className="text-sm text-gray-500">
              Track your store's progress to boost your sales.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExport} icon={Download}>
              Export
            </Button>
            <Link
              href={"/admin/add-product"}
              className="items-center inline-flex bg-green-600 hover:bg-green-700 transition rounded-lg px-4 py-2 gap-2 text-sm shadow-xs"
            >
              <Plus className="text-white w-4" />
              <span className="text-white font-medium">Add Product</span>
            </Link>
          </div>
        </div>
        {/* div buat search sama filter */}
        <div className="px-5 py-4 border-b border-b-gray-200">
          <div className="flex gap-3 justify-between">
            <ProductFilter onFilter={handleFilter} />
          </div>
        </div>
        <Table
          columns={["No", "Image", "Name", "Description", "Price", ""]}
          data={products}
          renderRow={(p, index) => (
            <tr
              key={p.id}
              className="hover:bg-gray-50 transition text-xs sm:text-sm"
            >
              <td className="border-b border-gray-200 px-5 py-4 text-center">{index + 1}</td>
              <td className="border-b border-gray-200 px-5 py-4 text-center">
                <div className="size-16 relative">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="64px"
                    className="rounded-md object-cover"
                  />
                </div>
              </td>
              <td className="border-b border-gray-200 px-5 py-4">{p.name}</td>
              <td className="border-b border-gray-200 px-5 py-4">{p.description}</td>
              <td className="border-b border-gray-200 px-5 py-4">Rp{p.price.toLocaleString("id-ID")}</td>
              <td className="border-b border-gray-200 px-5 py-4 text-center">
                <div
                  className="hover:bg-gray-100 transition rounded p-2 cursor-pointer"
                  onClick={() => {
                    setSelectedProductId(
                      selectedProductId === p.id ? null : p.id
                    );
                  }}
                >
                  <Ellipsis className="text-gray-500 w-4 sm:w-6" />
                </div>
                <div
                  className={clsx(
                    "bg-white border border-gray-100 shadow-xl p-2 rounded absolute right-5 mt-1 z-10 w-32",
                    {
                      hidden: selectedProductId !== p.id,
                    }
                  )}
                >
                  <div className="flex flex-col items-start">
                    <Link
                      href={`/admin/update-product/${p.id}`}
                      className="p-2 text-xs sm:text-sm w-full hover:bg-gray-100 rounded text-left cursor-pointer"
                    >
                      Edit
                    </Link>
                    <button
                      disabled={loadingId === p.id}
                      className={`p-2 text-xs sm:text-sm w-full hover:bg-gray-100 rounded text-left ${
                        loadingId === p.id
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer text-red-600"
                      }`}
                      onClick={() => handleDelete(p.id)}
                    >
                      {loadingId === p.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(currentPage * pagination.limit, pagination.totalCount)} of{" "}
              {pagination.totalCount} results
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchProducts(filters, currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-3 py-2 rounded-lg border transition ${
                  pagination.hasPrevPage
                    ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Prev
              </button>

              {/* Page numbers */}
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
                        onClick={() => fetchProducts(filters, pageNum)}
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
                onClick={() => fetchProducts(filters, currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-3 py-2 rounded-lg border transition ${
                  pagination.hasNextPage
                    ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
