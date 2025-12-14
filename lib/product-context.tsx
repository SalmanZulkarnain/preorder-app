"use client";
import { Product } from "@/prisma/generated/prisma/client";
import { createContext, useContext, useState, useEffect } from "react";

type ProductContextType = {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    fetchProducts: () => Promise<void>;
    loading: boolean;
}

const ProductContext = createContext<ProductContextType>(null);

export function ProductProvider({ children }: { children: React.ReactNode; }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
            if (!response.ok) throw new Error('Gagal fetch data product');
            const result = await response.json();
            setProducts(result.data);
        } catch (error) {
            console.error('Error ambil product: ', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, setProducts, fetchProducts, loading }}>
            {children}
        </ProductContext.Provider>
    )
}

export function useProduct() {
    return useContext(ProductContext);
}