"use client";

import { useState, useEffect } from "react";
import CartList from "@/components/features/cart/CartList";
import Checkout from "@/components/features/cart/Checkout";

// Komponen Halaman (Server Component)
export default function CartPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`);
      const result = await res.json();
      setCarts(result.data || []);
    } catch (error) {
      console.error("Error fetching carts: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <div className="grid items-start max-w-6xl grid-cols-1 gap-6 mx-auto lg:grid-cols-3">
      <CartList carts={carts} setCarts={setCarts} loading={loading} fetchCarts={fetchCarts} />
      <Checkout carts={carts} fetchCarts={fetchCarts} />
    </div>
  );
}
