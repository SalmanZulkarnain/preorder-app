import type { Prisma } from "@/prisma/generated/prisma/client";

export type PaymentWithOrder = Prisma.PaymentGetPayload<{
    include: {
        order: {
            include: {
                customer: true;
                orderItems: {
                    include: { product: true };
                };
            };
        };
    };
}>;

export type MidtransWebhookPayload = {
    order_id: string;
    transaction_id: string;
    payment_type: string;
    va_numbers?: Array<{ bank: string; va_number: string }>;
    gross_amount: string | number;
    transaction_status: string;
    fraud_status?: string;
    transaction_time?: string;
    settlement_time?: string;
    expiry_time?: string;
    status_code: string;
    signature_key: string;
};
