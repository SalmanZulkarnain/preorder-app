import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { orderId } = await request.json();

        const order = await prisma.order.findFirst({
            where: { id: orderId },
            include: { customer: true }
        });

        if (!order) {
            return NextResponse.json({
                message: "Order tidak bisa difetch",
                success: false
            }, { status: 400 });
        }

        const orderItems = await prisma.orderItem.findMany({
            where: { orderId: order.id },
            include: { product: true }
        });

        const parameter = {
            transaction_details: {
                order_id: order.transactionId,
                gross_amount: order.totalAmount
            },
            item_details: orderItems.map(item => ({
                id: item.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.priceAtOrder
            })
            ),
            customer_details: {
                first_name: order.customer.name, 
                phone: order.customer.phoneNumber,
                email: `${order.customer.name.replace(/\s+/g, '').toLowerCase()}@gmail.com`
            }
        };

        const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                Authorization: "Basic " + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64")
            },
            body: JSON.stringify(parameter)
        })

        const result = await response.json();

        return NextResponse.json({
            token: result.token,
            redirect_url: result.redirect_url
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Terjadi error di server",
            success: false,
            error: error.message
        }, { status: 500 });
    }
}