import type { PaymentWithOrder } from "@/types/payment";

type Pagination = {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
} | null;

export async function getPayment() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payment`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return {
            data: (result.data as PaymentWithOrder[]) || [],
            pagination: (result.pagination as Pagination) || null,
        };
    } catch (error) {
        console.error("Failed to fetch payments: ", error);
        return {
            data: [],
            pagination: null,
        };
    }
}

export async function getData() {
    try {
        const response = await fetch(`/api/customer`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Failed to fetch customer data: ", error);
        return { success: false, message: "Failed to fetch data" };
    }
}
