"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import type { PaymentWithOrder } from "@/types/payment";

type PaymentFilters = Record<string, string>;

type PaymentContextType = {
    payments: PaymentWithOrder[];
    setPayments: React.Dispatch<React.SetStateAction<PaymentWithOrder[]>>;
    fetchPayments: (filters?: PaymentFilters) => Promise<void>;
    loading: boolean;
    handleFilter: (newFilters: PaymentFilters) => void;
};

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
    const [payments, setPayments] = useState<PaymentWithOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<PaymentFilters>({});

    const handleFilter = useCallback((newFilters: PaymentFilters) => {
        setFilters(newFilters);
    }, []);

    const fetchPayments = async (filterParams: PaymentFilters = filters) => {
        try {
            const params = new URLSearchParams(filterParams).toString();
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment?${params}`);

            if (!res.ok) throw new Error("Gagal fetch data payment");

            const data = await res.json();
            setPayments(data.data);
        } catch (error) {
            console.error("Error ambil payment: ", error);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments(filters);
    }, [filters]);

    return (
        <PaymentContext.Provider
            value={{ payments, setPayments, fetchPayments, loading, handleFilter }}
        >
            {children}
        </PaymentContext.Provider>
    );
}

export function usePayment() {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error("usePayment must be used within PaymentProvider");
    }
    return context;
}
