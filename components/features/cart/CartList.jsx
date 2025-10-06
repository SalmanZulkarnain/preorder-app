"use client";

import CartCard from "./CartCard";
import { useCart } from "@/lib/cart-context";
import HandlerButton from "./handleCartBtn";
import { useRef } from "react";

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

  const debounceTimers = useRef({});

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
                  : Math.max(0, cart.quantity - 1),
            }
            : cart
        )
        .filter((cart) => cart.quantity > 0)
    );

    if (debounceTimers.current[cartId]) {
      clearTimeout(debounceTimers.current[cartId]);
    }

    debounceTimers.current[cartId] = setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operation }),
        });

        if (!res.ok) throw new Error("Update failed");

        const result = await res.json();

        if (result.message === "Cart deleted successfully") {
          setCarts(prev => prev.filter(cart => cart.id !== cartId))
        }
      } catch (error) {
        setCarts(originalCarts);
      }
    }, 400);
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
          <HandlerButton cart={c} onDelete={handleDelete} onUpdateQuantity={handleUpdateQuantity} />
        </CartCard>
      ))}
    </div>
  );
}
