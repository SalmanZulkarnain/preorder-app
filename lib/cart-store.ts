import { Prisma } from "@prisma/client";
import { create } from "zustand"

type CartWithProduct = Prisma.CartGetPayload<{
    include: { product: true }
}> 

interface CartStore {
    // State
    carts: CartWithProduct[],
    isLoading: boolean,
    error: string | null,

    // Actions
    fetchCarts: () => Promise<void>;
    addCart: (productId: number) => Promise<void>;

    // loading, error
    setLoading: (loading: boolean) => void,
    setError: (error: string) => void
}

export const useCartStore = create<CartStore>((set, get) => ({
    carts: [],
    isLoading: false,
    error: null,

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error: error }),

    fetchCarts: async () => {
        // if (get().isLoading || get().carts.length > 0) return;
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`);
            const result = await response.json();

            if (result.success){
                set({ carts: result.data, isLoading: false })
            } else {
                set({ carts: result.message, isLoading: false })
            }
        } catch (error) {
            console.error('Fetch carts error: ', error);
            set({ error: 'Failed to fetch carts', isLoading: false })
        }
    },

    addCart: async (productId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                credentials: "include",
                body: JSON.stringify({ productId }),
            });

            const result = await response.json();

            if (result.success){
                const newCart = result.data;
                set((state) => ({
                    carts: [newCart, ...state.carts],
                    isLoading: false
                }))
            } else {
                set({ carts: result.message, isLoading: false })
            }
        } catch (error) {
            console.error('Fetch carts error: ', error);
            set({ error: 'Failed to add cart', isLoading: false })
        }
    },

    // updateCart: async (id: number, data: { quantity: }) => {
    //     set({ isLoading: true, error: null });
    //     try {
    //         const response = await fetch(`/api/cart/${id}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ })
    //         });
    //         const result = await response.json();

    //         if (result.success){
    //             set({ carts: result.data, isLoading: false })
    //         } else {
    //             set({ carts: result.message, isLoading: false })
    //         }
    //     } catch (error) {
    //         console.error('Fetch carts error: ', error);
    //     }
    // }
}));