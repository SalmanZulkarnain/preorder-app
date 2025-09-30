"use client";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }) {
  const { fetchCarts } = useCart();

  const handleAdd = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) throw new Error("Gagal tambah ke keranjang");

      await fetchCarts();
    } catch (error) {
      console.error("Add to cart failed: ", error);
    }
  };
  return (
    <div className="bg-white rounded-sm hover:outline hover:outline-green-600 duration-100 hover:shadow-sm flex">
      <div className="h-40 w-[160] rounded-t-sm relative p-4">
        <img
          src={product.image}
          alt={product.name}
          width={256}
          height={256}
          className="w-full h-full object-cover rounded-t-sm"
        ></img>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between ">
        <h4 className="font-medium mb-4">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center gap-4">
          <h4 className="font-bold">{product.price.toLocaleString("id-ID")}</h4>
          <button
            onClick={handleAdd}
            className="bg-green-700 p-3 cursor-pointer rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
