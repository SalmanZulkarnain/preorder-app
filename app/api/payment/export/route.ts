import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import { Prisma, OrderStatus } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth/requireAuth";

export async function GET(req: NextRequest) {
    const user = await requireAuth();

    if (!user) {
        return NextResponse.json({
            message: "Unauthorized", success: false
        }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status")?.toUpperCase();
        const paymentType = searchParams.get("paymentType")?.toLowerCase();

        const where: Prisma.PaymentWhereInput = {};

        if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
            where.order = {
                status: status as OrderStatus
            };
        }

        if (paymentType && ['qris', 'bank_transfer', 'echannel'].includes(paymentType)) {
            where.paymentType = paymentType;
        }

        const payments = await prisma.payment.findMany({
            where,
            include: {
                order: {
                    include: {
                        customer: true
                    }
                }
            },
            orderBy: {
                transactionTime: 'desc'
            }
        });

        const data = payments.map((p) => ({
            Date: new Date(p.transactionTime!).toLocaleString('id-ID'),
            'Transaction ID': p.transactionId,
            'Payment Type': p.paymentType.toUpperCase(),
            Status: p.order.status,
            Amount: p.grossAmount,
            Customer: p.order.customer.name,
            Phone: p.order.customer.phoneNumber
        }));

        const csv = Papa.unparse(data);

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="transactions-${Date.now()}.csv"`
            }
        });
    } catch (error) {
        console.error('Export error: ', error);
        return NextResponse.json({
            error: 'Export failed'
        }, { status: 500 });
    }
}
