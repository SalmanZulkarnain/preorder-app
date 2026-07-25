import { Order } from "@/generated/prisma/client";
import { prisma } from "../prisma";

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
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }});   
    if (!orders) throw new Error("Order tidak ditemukan");
    return Promise.all(orders.map(checkAndExpireIfStale));
}

export async function getOrdersForAdmin() {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc"}});
    return Promise.all(orders.map(checkAndExpireIfStale));
}