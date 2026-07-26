import { MidtransWebhookPayload } from "@/types/payment";
import { buildPaymentFilter } from "../domain/payment/buildPaymentFilter";
import { verifyMidtransSignature } from "../domain/payment/verifySignature";
import { mapMidtransStatusToOrderStatus } from "../domain/payment/mapMidtransStatus";
import { prisma } from "../prisma";

type GetPaymentsParams = {
    paymentType?: string;
    date?: string | null;
    status?: string;
    transactionId?: string;
    page: number;
    limit: number;
}

export async function getAllPayments(params: GetPaymentsParams) {
    const where = buildPaymentFilter(params);
    const skip = (params.page - 1) * params.limit;

    const [payments, totalCount] = await Promise.all([
        prisma.payment.findMany({
            where,
            select: {
                id: true,
                transactionId: true,
                midtransTransactionId: true,
                paymentType: true,
                bank: true,
                vaNumber: true,
                grossAmount: true,
                transactionStatus: true,
                fraudStatus: true,
                transactionTime: true,
                expiryTime: true,
                createdAt: true,
                updatedAt: true,
                order: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                name: true,
                                phoneNumber: true
                            }
                        },
                        orderItems: {
                            select: {
                                id: true,
                                quantity: true,
                                priceAtOrder: true,
                                product: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                transactionTime: 'desc'
            },
            skip,
            take: params.limit
        }),
        prisma.payment.count({ where })
    ]);

    return {
        payments,
        pagination: {
            page: params.page,
            limit: params.limit,
            totalCount,
            totalPages: Math.ceil(totalCount / params.limit),
            hasNextPage: params.page < Math.ceil(totalCount / params.limit),
            hasPrevPage: params.page > 1
        }
    };
}

export async function processMidtransWebhook(payload: MidtransWebhookPayload) {
    const isValid = verifyMidtransSignature({
        orderId: payload.order_id,
        statusCode: payload.status_code,
        grossAmount: payload.gross_amount,
        signatureKey: payload.signature_key,
        serverKey: process.env.MIDTRANS_SERVER_KEY!
    });

    if (!isValid) throw new Error("Invalid signature key");

    const order = await prisma.order.findUnique({ where: { transactionId: payload.order_id }});

    if (!order) throw new Error("Order not found");

    const orderStatus = mapMidtransStatusToOrderStatus(payload.transaction_status);

    const payloads = {
        midtransTransactionId: payload.transaction_id,
        paymentType: payload.payment_type,
        bank: payload.va_numbers?.[0]?.bank ?? null,
        vaNumber: payload.va_numbers?.[0]?.va_number ?? null,
        grossAmount: parseInt(String(payload.gross_amount)),
        transactionStatus: payload.transaction_status,
        fraudStatus: payload.fraud_status,
        transactionTime: payload.transaction_time ? new Date(payload.transaction_time) : null,
        expiryTime: payload.expiry_time ? new Date(payload.expiry_time) : null,
        rawResponse: payload as any,
    }

    const payment = await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        ...payloads
      },
      create: {
        orderId: order.id,
        transactionId: payload.order_id,
        ...payloads,
      },
    });

    await prisma.order.update({
        where: { id: order.id },
        data: { status: orderStatus}
    });

    return payment;
}