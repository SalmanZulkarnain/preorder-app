"use client";

import { PaymentWithOrder } from "@/types/payment";
import { useEffect, useRef, useState } from "react";

type Pagination = {
    limit: number;
    totalCount: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
};

export type InitialPayments = {
    data?: PaymentWithOrder[];
    pagination?: Pagination | null;
};

export function usePaymentTable(filters: Record<string, string>, initialPayments?: InitialPayments) {
    const [payments, setPayments] = useState<PaymentWithOrder[]>(
        initialPayments?.data || [],
    );
    const [pagination, setPagination] = useState<Pagination | null>(
        initialPayments?.pagination || null,
    );
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const isInitialMount = useRef(true);

    const fetchPayments = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                ...filters,
                page: page.toString(),
                limit: "10",
            }).toString();

            const res = await fetch(`/api/payment?${params}`);

            if (!res.ok) throw new Error("Failed to fetch payment");

            const result = await res.json();
            setPayments(result.data);
            setPagination(result.pagination);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching payment: ", error);
            setPayments([]);
        } finally {
            setLoading(false);

        };
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const hasFilters = Object.values(filters).some((value) => value !== "");

        if (hasFilters) {
            fetchPayments(1);
        } else {
            setPayments(initialPayments?.data || []);
            setPagination(initialPayments?.pagination || null);
            setCurrentPage(1);
        }
    }, [filters]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
        fetchPayments(newPage);
    };

    return {
        payments, 
        pagination, 
        loading, 
        currentPage,
        handlePageChange
    }
}