import prisma from "@/lib/db";
import type { Prisma } from "@/prisma/generated/prisma/client";

type DateRange = Prisma.DateTimeFilter;

const getDailySalesData = async () => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    const payments = await prisma.payment.findMany({
        where: {
            transactionStatus: "settlement",
            transactionTime: { gte: last7Days },
        },
        select: {
            grossAmount: true,
            transactionTime: true,
        },
    });

    const dailyData: Record<string, number> = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = dayNames[date.getDay()];
        dailyData[dayName] = 0;
    }

    payments.forEach((payment) => {
        const date = new Date(payment.transactionTime!);
        const dayName = dayNames[date.getDay()];
        dailyData[dayName] += Number(payment.grossAmount);
    });

    return Object.entries(dailyData).map(([day, revenue]) => ({
        day,
        revenue,
    }));
};

const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) {
        if (current === 0) return 0;
        return 100;
    }

    const growth = ((current - previous) / previous) * 100;
    return parseFloat(growth.toFixed(1));
};

const getCustomerStats = async (range: DateRange) => {
    return prisma.customer.count({
        where: {
            orders: {
                some: {
                    payments: {
                        some: {
                            transactionStatus: "settlement",
                            transactionTime: range,
                        },
                    },
                },
            },
        },
    });
};

const getRevenueStats = async (range: DateRange) => {
    return prisma.payment.aggregate({
        _sum: { grossAmount: true },
        _count: true,
        where: {
            transactionStatus: "settlement",
            transactionTime: range,
        },
    });
};

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export async function getDashboardData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [todayStats, yesterdayStats, weeksStats, lastWeekStats, pendingPayments, totalProducts] =
        await Promise.all([
            getRevenueStats({ gte: today }),
            getRevenueStats({ gte: yesterday, lt: today }),
            getRevenueStats({ gte: week }),
            getRevenueStats({ gte: lastWeek, lt: week }),
            prisma.payment.count({
                where: { transactionStatus: "pending" },
            }),
            prisma.product.count(),
        ]);

    const [uniqueCustomersThisWeek, uniqueCustomersLastWeek] = await Promise.all([
        getCustomerStats({ gte: week }),
        getCustomerStats({ gte: lastWeek, lt: week }),
    ]);

    const customerChangeWeekly = calculateGrowth(
        uniqueCustomersThisWeek,
        uniqueCustomersLastWeek
    );
    const orderChangeWeekly = calculateGrowth(weeksStats._count, lastWeekStats._count);

    const dailyRevenue = +(todayStats._sum.grossAmount ?? 0);
    const yesterdayRevenue = +(yesterdayStats._sum.grossAmount ?? 0);
    const weeklyRevenue = +(weeksStats._sum.grossAmount ?? 0);
    const lastWeekRevenue = +(lastWeekStats._sum.grossAmount ?? 0);

    const revenueChangeDaily = calculateGrowth(dailyRevenue, yesterdayRevenue);
    const revenueChangeWeekly = calculateGrowth(weeklyRevenue, lastWeekRevenue);

    const salesData = await getDailySalesData();

    return {
        dailyRevenue,
        revenueDailyPercent: `${revenueChangeDaily}%`,
        weeklyRevenue,
        revenueWeeklyPercent: `${revenueChangeWeekly}%`,
        todayOrders: todayStats._count,
        weeklyOrders: weeksStats._count,
        weeklyOrdersPercent: `${orderChangeWeekly}%`,
        avgOrderValue: todayStats._count ? Math.round(dailyRevenue / todayStats._count) : 0,
        pendingPayments,
        totalProducts,
        weeklyCustomers: uniqueCustomersThisWeek,
        weeklyCustomersPercent: `${customerChangeWeekly}%`,
        salesData,
    };
}
