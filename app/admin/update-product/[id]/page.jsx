"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, Toaster } from "sonner";

export default function ProductUpdate({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
      );
      if (!response.ok) throw new Error("Gagal fetch data produk");
      const result = await response.json();

      setName(result.data.name);
      setDescription(result.data.description);
      setPrice(result.data.price?.toString());
      setPreview(result.data.image);
    } catch (error) {
      console.error("Error fetch produk: ", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price.trim()) {
      alert("Isi semua field dulu!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("id", id);
    if (image) formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          router.push("/admin/product");
        }, 1000);
      } else {
        toast.error("Gagal simpan produk!");
      }
    } catch (error) {
      console.error("Error saat kirim produk: ", error);
      alert("Terjadi error, cek console!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Update Product</h2>
        <Toaster duration={2000} richColors position="top-center" />
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-600 hover:file:bg-green-100"
            />
            {preview && (
              <div className="w-full h-60 relative">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Input product name"
              className="p-2 mt-1 w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Input product description"
              className="p-2 mt-1 w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 h-24"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Input product price"
              className="p-2 mt-1 w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "bg-green-600 cursor-pointer"
            }`}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
