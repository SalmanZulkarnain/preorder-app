import { OrderStatus, Prisma } from "@/generated/prisma/client";

function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

type PaymentFilterParams = {
    paymentType?: string;
    date?: string | null;
    status?: string;
    transactionId?: string; 
}

export function buildPaymentFilter(params: PaymentFilterParams): Prisma.PaymentWhereInput {
    const where: Prisma.PaymentWhereInput = {};

    if (params.paymentType && ['qris', 'bank_transfer', 'echannel'].includes(params.paymentType)) {
        where.paymentType = params.paymentType;
    }

    if (params.date && isValidDate(params.date)) {
        const startDate = new Date(params.date);
        const endDate = new Date(params.date);
        endDate.setDate(endDate.getDate() + 1);

        where.transactionTime = {
            gte: startDate,
            lt: endDate
        };
    }

    if (params.status && Object.values(OrderStatus).includes(params.status as OrderStatus)) {
        where.order = {
            status: params.status as OrderStatus
        };
    }

    if (params.transactionId && params.transactionId.length > 0) {
        where.transactionId = {
            contains: params.transactionId,
            mode: "insensitive"
        };
    }

    return where;
}