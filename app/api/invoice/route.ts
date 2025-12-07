import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const raw = cookieStore.get("myTransactions")?.value;
        if (!raw) return NextResponse.json({ success: true, data: [] });

        let ids = [];
        try {
            ids = JSON.parse(raw);
        } catch (err) {
            try {
                ids = JSON.parse(decodeURIComponent(raw));
            } catch (err2) {
                ids = [];
            }
        }
        if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ success: true, data: [] });

        const orders = await prisma.order.findMany({
            where: { transactionId: { in: ids } },
            include: {
                payments: true,
                orderItems: { include: { product: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ success: true, data: orders })
    } catch (error) {
        console.error("Failed to fetch recent transactions:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { transactionId } = await request.json();

        if (!transactionId) {
            return NextResponse.json({ success: false, message: "transactionId is required" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { transactionId },
            include: {
                orderItems: { include: { product: true } },
                payments: true
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data: {
                redirectUrl: order.redirectUrl ?? null,
                token: order.token ?? null,
                status: order.status,
                order
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Find transaction error:', error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}