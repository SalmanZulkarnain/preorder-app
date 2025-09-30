"use client";
import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductCreate() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !name.trim() || !price.trim()) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setName("");
        setDescription("");
        setPrice("");
        setImage(null);
        setPreview("");
        e.target.reset();
        setTimeout(() => {
          router.push("/admin/product");
        }, 1000);
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error while adding product: ", error);
      toast.error("Terjadi error, cek console!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Tambah Produk Baru
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Gambar Produk
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {preview && (
              <Image
                src={preview}
                width={400}
                height={300}
                alt="Preview"
                className="mt-2 rounded-lg border border-gray-200"
              />
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nama Produk
            </label>
            <input
              type="text"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama produk"
              className="p-2 mt-1 w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi produk"
              className="p-2 mt-1 w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 h-24"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Harga
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Masukkan harga"
              className="p-2 mt-1 w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "bg-green-600 cursor-pointer"
            }`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>

        <Toaster position="top-center" richColors duration={2000} />
      </div>
    </div>
  );
}
