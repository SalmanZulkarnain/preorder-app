"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);

            if (!res.ok) throw new Error('Gagal fetch data product');

            const data = await res.json();
            setProducts(data.data);
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