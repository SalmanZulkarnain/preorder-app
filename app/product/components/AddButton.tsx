"use client";

import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchCarts } = useCart();

  const handleAdd = async (e) => {
    e.stopPropagation();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      setAdded(true);
      setTimeout(() => setAdded(false), 1500);

      await fetchCarts();
    } catch (error) {
      console.error("Add to cart failed: ", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={`p-3 cursor-pointer rounded-full transition-all duration-200 ${added ? 'bg-green-600 scale-110' : 'bg-green-600 hover:bg-green-700 active:scale-95'} disabled:opacity-75`}
    >
      {added ? <Check className="size-4 text-white" /> : <Plus className="size-4 text-white" />}

    </button>
  );
}
