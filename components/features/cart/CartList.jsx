"use client";

import CartCard from "./CartCard";
import { useCart } from "@/lib/cart-context";
import HandlerButton from "./HandleButton";
import { useRef } from "react";

export default function CartList() {
  const { carts, setCarts, loading } = useCart();

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
  const quantityRefs = useRef({});

  const handleUpdateQuantity = async (cartId, operation) => {
    const originalCarts = [...carts];

    setCarts((prev) =>
      prev
        .map((cart) => {
          if (cart.id === cartId) {
            const newQuantity = operation === "increment" ? cart.quantity + 1 : Math.max(0, cart.quantity - 1);

            quantityRefs.current[cartId] = newQuantity;

            return { ...cart, quantity: newQuantity }
          }

          return cart;
        }).filter((cart) => cart.quantity > 0)
    );

    if (debounceTimers.current[cartId]) {
      clearTimeout(debounceTimers.current[cartId]);
    }

    debounceTimers.current[cartId] = setTimeout(async () => {
      try {
        const finalQuantity = quantityRefs.current[cartId];
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: finalQuantity }),
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
  }

  if (loading)
    return (
      <div className="text-xl text-center text-gray-600 lg:col-span-2">
        Loading...
      </div>
    );

  if (!carts || carts.length === 0)
    return (
      <p className="p-20 text-xl text-center text-gray-600 lg:col-span-2">
        Tidak ada produk di keranjang saat ini.
      </p>
    );

  return (
    <div className="grid grid-cols-1 gap-2 lg:gap-6 lg:col-span-2">
      {carts.map(cart => (
        <CartCard key={cart.id} cart={cart}>
          <HandlerButton cart={cart} onDelete={handleDelete} onUpdateQuantity={handleUpdateQuantity} />
        </CartCard>
      ))}
    </div>
  );
}
