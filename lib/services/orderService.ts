import { Order } from "@/generated/prisma/client";
import { prisma } from "../prisma";
import { cookies } from "next/headers";

async function checkAndExpireIfStale(order: Order): Promise<Order> {
    const pageExpiryMinutes = 5;
    const cutoff = new Date(Date.now() - pageExpiryMinutes * 60 * 1000);

    if (order.status === "WAITING_PAYMENT_METHOD" && order.createdAt < cutoff) {
        return prisma.order.update({
            where: { id: order.id },
            data: { status: "EXPIRED" }
        })
    }

    return order;
}

export async function getOrdersBySession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
        return [];
    }

    const orders = await prisma.order.findMany({ where: { sessionId }, orderBy: { createdAt: "desc" } });
    if (!orders) throw new Error("Orders not found");

    return Promise.all(orders.map(checkAndExpireIfStale));
}