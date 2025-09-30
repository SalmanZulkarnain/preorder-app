import prisma from "@/lib/prisma";

async function getDailySalesData() {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    const payments = await prisma.payment.findMany({
        where: {
            transactionStatus: 'settlement',
            transactionTime: { gte: last7Days }
        },
        select: {
            grossAmount: true,
            transactionTime: true
        }
    });

    // Group by day
    const dailyData = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize semua hari dengan 0
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = dayNames[date.getDay()];
        dailyData[dayName] = 0;
    }

    // Sum revenue per hari
    payments.forEach(payment => {
        const date = new Date(payment.transactionTime);
        const dayName = dayNames[date.getDay()];
        dailyData[dayName] += Number(payment.grossAmount);
    });

    // Convert ke format yang lo mau
    const salesData = Object.entries(dailyData).map(([day, revenue]) => ({
        day,
        revenue
    }));

    return salesData;
}

export async function getDashboardData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [todayStats, yesterdayStats, weeksStats, pendingPayments, totalProducts] = await Promise.all([
        // Today's data
        prisma.payment.aggregate({
            _sum: { grossAmount: true },
            _count: true,
            where: {
                transactionStatus: 'settlement',
                transactionTime: { gte: today }
            }
        }),

        // Yesterday's data for comparison
        prisma.payment.aggregate({
            _sum: { grossAmount: true },
            _count: true,
            where: {
                transactionStatus: 'settlement',
                transactionTime: { gte: yesterday, lt: today }
            }
        }),

        // Week data
        prisma.payment.aggregate({
            _sum: { grossAmount: true },
            _count: true,
            where: {
                transactionStatus: 'settlement',
                transactionTime: { gte: week }
            }
        }),

        prisma.payment.count({
            where: { transactionStatus: 'pending' }
        }),

        prisma.product.count()
    ]);

    const uniqueCustomers = await prisma.customer.count({
        where: {
            orders: {
                some: {
                    payments: {
                        some: {
                            transactionStatus: 'settlement',
                            transactionTime: {
                                gte: week
                            }
                        }
                    }
                }
            }
        }
    });

    const salesData = await getDailySalesData();

    const dailyRevenue = + todayStats._sum.grossAmount || 0;
    const yesterdayRevenue = + yesterdayStats._sum.grossAmount || 0;
    const weeklyRevenue = + weeksStats._sum.grossAmount || 0;

    const revenueChangeDaily = yesterdayRevenue ? ((dailyRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1) : 0;
    const revenueChangeWeekly = weeklyRevenue ? ((dailyRevenue - weeklyRevenue) / weeklyRevenue * 100).toFixed(1) : 0;
    return {
        dailyRevenue,
        weeklyRevenue,
        todayOrders: todayStats._count,
        weeklyOrders: weeksStats._count,
        revenueDailyPercent: `${revenueChangeDaily}%`,
        revenueWeeklyPercent: `${revenueChangeWeekly}%`,
        avgOrderValue: todayStats._count ? Math.round(dailyRevenue / todayStats._count) : 0,
        pendingPayments,
        totalProducts,
        weeklyCustomers: uniqueCustomers,
        salesData
    }
}