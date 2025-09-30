"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const handleFilter = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []); 

    const fetchPayments = async (filters) => {
        try {
            const params = new URLSearchParams(filters).toString();
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment?${params}`);

            if (!res.ok) throw new Error('Gagal fetch data payment');

            const data = await res.json();
            setPayments(data.data);
        } catch (error) {
            console.error('Error ambil payment: ', error);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPayments(filters);
    }, [filters]);

    return (
        <PaymentContext.Provider value={{ payments, setPayments, fetchPayments, loading, handleFilter }}>
            {children}
        </PaymentContext.Provider>
    )
}

export function usePayment() {
    return useContext(PaymentContext);
}