import { Prisma } from "@/generated/prisma/client";
import { create } from "zustand";

type CartWithProduct = Prisma.CartGetPayload<{
    include: { product: true };
}>;

interface CartStore {
    carts: CartWithProduct[];
    isLoading: boolean;
    error: string | null;
    fetchCarts: () => Promise<void>;
    addCart: (productId: number) => Promise<void>;
    setCarts: (updater: CartWithProduct[] | ((prev: CartWithProduct[]) => CartWithProduct[])) => void;
    clearCarts: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
    carts: [],
    isLoading: false,
    error: null,

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    setCarts: (updater) =>
        set(state => ({
            carts: typeof updater === "function" ? updater(state.carts) : updater
        })),

    clearCarts: () => set({ carts: [] }),

    fetchCarts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/cart`);
            const result = await response.json();

            if (result.success) {
                set({ carts: result.data, isLoading: false });
            } else {
                set({
                    carts: [],
                    error: result.message || "Failed to fetch carts",
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error("Fetch carts error: ", error);
            set({ error: "Failed to fetch carts", isLoading: false });
        }
    },

    addCart: async (productId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ productId }),
            });

            const result = await response.json();

            if (result.success) {
                const newCart = result.data;
                set((state) => ({
                    carts: [newCart, ...state.carts],
                    isLoading: false,
                }));
            } else {
                set({
                    error: result.message || "Failed to add cart",
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error("Fetch carts error: ", error);
            set({ error: "Failed to add cart", isLoading: false });
        }
    },

}));
