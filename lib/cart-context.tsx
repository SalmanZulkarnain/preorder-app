"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Prisma } from "@prisma/client";

type CartWithProduct = Prisma.CartGetPayload<{
    include: { product: true }
}>

type CartContextType = {
    carts: CartWithProduct[];
    setCarts: React.Dispatch<React.SetStateAction<CartWithProduct[]>>;
    fetchCarts: () => Promise<void>;
    totalItems: number;
    totalAmount: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [carts, setCarts] = useState<CartWithProduct[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCarts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`);

            if (!response.ok) throw new Error('Gagal fetch data cart');

            const result = await response.json();
            setCarts(result.data as CartWithProduct[]);
        } catch (error) {
            console.error("Error fetching carts: ", error);
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
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}