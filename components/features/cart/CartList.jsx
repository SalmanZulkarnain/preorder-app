"use client";

import CartCard from "./CartCard";
import { useCart } from "@/lib/cart-context";

export default function CartList() {
  const { carts, setCarts, loading, fetchCarts } = useCart();

  const handleDelete = async (cartId) => {
    const originalCarts = [...carts];
    setCarts((prev) => prev.filter((cart) => cart.id !== cartId));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch (error) {
      setCarts(originalCarts);
    }
  };

  const handleUpdateQuantity = async (cartId, operation) => {
    const originalCarts = [...carts];

    setCarts((prev) =>
      prev
        .map((cart) =>
          cart.id === cartId
            ? {
                ...cart,
                quantity:
                  operation === "increment"
                    ? cart.quantity + 1
                    : Math.max(1, cart.quantity - 1),
              }
            : cart
        )
        .filter((cart) => cart.quantity > 0)
    );

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation }),
      });

      if (!res.ok) throw new Error("Update failed");

      const result = await res.json();

      if (result.message === "Cart deleted") fetchCarts();
    } catch (error) {
      setCarts(originalCarts);
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-600 text-xl lg:col-span-2">
        Loading...
      </div>
    );

  if (!carts || carts.length === 0)
    return (
      <p className="text-center text-gray-600 text-xl p-20 lg:col-span-2">
        Tidak ada produk yang tersedia saat ini.
      </p>
    );

  return (
    <div className="grid grid-cols-1 lg:col-span-2 gap-6">
      {carts.map((c) => (
        <CartCard key={c.id} cart={c}>
          {/* hapus */}
          <button
            onClick={() => handleDelete(c.id)}
            className="p-3 cursor-pointer rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          {/* container minus, jumlah, dan plus */}
          <div className="sm:h-10 h-8 flex items-center outline outline-gray-500 rounded-full">
            {/* minus */}
            <button
              onClick={() => handleUpdateQuantity(c.id, "decrement")}
              className="p-3 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="text"
              className="text-center sm:w-8 w-5"
              readOnly
              value={c.quantity}
            />
            {/* plus */}
            <button
              onClick={() => handleUpdateQuantity(c.id, "increment")}
              className="p-3 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />{" "}
              </svg>
            </button>
          </div>
        </CartCard>
      ))}
    </div>
  );
}
