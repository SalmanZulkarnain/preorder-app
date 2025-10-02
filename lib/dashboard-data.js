import prisma from "@/lib/prisma";

const getDailySalesData = async () => {
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

const calculateGrowth = (current, previous) => {
    if (previous === 0) {
        if (current === 0) return 0;
        return 100;
    }

    const growth = (current - previous) / previous * 100;
    return parseFloat(growth.toFixed(1));
}

const getCustomerStats = async (range) => {
    return prisma.customer.count({
        where: {
            orders: {
                some: {
                    payments: {
                        some: {
                            transactionStatus: 'settlement',
                            transactionTime: range
                        }
                    }
                }
            }
        }
    });
}


const getRevenueStats = async (range) => {
    return prisma.payment.aggregate({
        _sum: { grossAmount: true },
        _count: true,
        where: {
            transactionStatus: 'settlement',
            transactionTime: range
        }
    });
}

export async function getDashboardData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)

    const [todayStats, yesterdayStats, weeksStats, lastWeekStats, pendingPayments, totalProducts] = await Promise.all([
        // Today's data
        getRevenueStats({ gte: today }),

        // Yesterday's data for comparison
        getRevenueStats({ gte: yesterday, lt: today }),

        // Week data
        getRevenueStats({ gte: week }),

        // Last Week data
        getRevenueStats({ gte: lastWeek, lt: week }),

        prisma.payment.count({
            where: { transactionStatus: 'pending' }
        }),

        prisma.product.count()
    ]);

    const [uniqueCustomersThisWeek, uniqueCustomersLastWeek] = await Promise.all([
        getCustomerStats({ gte: week }),
        getCustomerStats({ gte: lastWeek, lt: week })
    ]);

    const customerChangeWeekly = calculateGrowth(uniqueCustomersThisWeek, uniqueCustomersLastWeek);
    const orderChangeWeekly = calculateGrowth(weeksStats._count, lastWeekStats._count);

    const dailyRevenue = + todayStats._sum.grossAmount || 0;
    const yesterdayRevenue = + yesterdayStats._sum.grossAmount || 0;
    const weeklyRevenue = + weeksStats._sum.grossAmount || 0;
    const lastWeekRevenue = + lastWeekStats._sum.grossAmount || 0;
    

    console.log(weeklyRevenue);
    console.log(lastWeekRevenue);

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
        salesData
    }
}