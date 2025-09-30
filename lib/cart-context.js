"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCarts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`);

            if (!res.ok) throw new Error('Gagal fetch data cart');

            const data = await res.json();
            setCarts(data.data);
        } catch (error) {
            console.error('Error ambil cart: ', error);
            setCarts([]);
        } finally {
            setLoading(false);
        }
    }

    const totalItems = carts.reduce((sum, cart) => sum + cart.quantity, 0);
    const totalAmount = carts.reduce(
    (sum, cart) => sum + cart.quantity * cart.product.price,
    0
  );

    useEffect(() => {
        fetchCarts();
    }, []);

    return (
        <CartContext.Provider value={{ carts, setCarts, fetchCarts, totalItems, totalAmount, loading }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext);
}