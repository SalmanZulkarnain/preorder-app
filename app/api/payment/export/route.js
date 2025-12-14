import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import Papa from "papaparse";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status")?.toLowerCase();
        const paymentType = searchParams.get("paymentType")?.toLowerCase();

        const where = {};

        if (status && ['paid', 'pending', 'expired', 'cancelled'].includes(status)) {
            where.order = {
                status: status
            }
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
            Date: new Date(p.transactionTime).toLocaleString('id-ID'),
            'Transaction ID': p.transactionId,
            'Payment Type': p.paymentType.toUpperCase(),
            Status: p.order.status,
            Amount: p.grossAmount,
            Customer: p.order.customer.name,
            Phone: p.order.customer.phoneNumber

        }))

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