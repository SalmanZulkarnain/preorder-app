"use client";

import {
  Hourglass,
  Users,
  Box,
  DollarSign,
  Hamburger,
  MoveDown,
  MoveUp,
} from "lucide-react";
import { usePayment } from "@/lib/payment-context";
import SalesReportChart from "./SalesReportChart";
import Link from "next/link";
import { formatDate } from "@/lib/utils/formatDate";

export default function DashboardClient({ data, session }) {
  const { payments } = usePayment();
  const percentValue = parseFloat(data.revenueDailyPercent.replace('%', ''));
  const isPositive = percentValue >= 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl font-medium">Welcome back, {session.value}</p>
        <p className="text-gray-500">Here is what is going on in your store</p>
      </div>

      {/* card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="inline-flex bg-gray-100 rounded-xl p-3">
            <DollarSign className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">Revenue</p>
          <h3 className="text-2xl font-bold">
            Rp{data.weeklyRevenue.toLocaleString("id-ID")}
          </h3>
          <div>
            <p className="text-sm flex justify-between items-center">
              <span className="bg-red-100 rounded p-1 text-red-700">
                {data.revenueWeeklyPercent}
              </span>
              In 7days
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="inline-flex bg-gray-100 rounded-xl p-3">
            <Users className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">Customers</p>
          <h3 className="text-2xl font-bold">{data.weeklyCustomers}</h3>
          <div>
            <p className="text-sm flex justify-between items-center">
              <span className="bg-green-100 rounded p-1 text-green-700">
                +19%
              </span>
              In 7days
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="inline-flex bg-gray-100 rounded-xl p-3">
            <Box className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">Orders</p>
          <h3 className="text-2xl font-bold">{data.weeklyOrders}</h3>
          <div>
            <p className="text-sm flex justify-between items-center">
              <span className="bg-green-100 rounded p-1 text-green-700">
                +14%
              </span>
              In 7days
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="inline-flex bg-gray-100 rounded-xl p-3">
            <Hamburger className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">Products</p>
          <h3 className="text-2xl font-bold">{data.totalProducts}</h3>
          <div>
            <p className="text-sm flex justify-between items-center">
              <span className="bg-red-100 rounded p-1 text-red-700">-9%</span>In
              7days
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 md:grid-cols-5 gap-5 mt-5 items-start">
        <div className="bg-white rounded-xl p-4 space-y-4 sm:col-span-4 md:col-span-3">
          <SalesReportChart weeklyRevenue={data.weeklyRevenue.toLocaleString("id-ID")} salesData={data.salesData} revenueWeeklyPercent={data.revenueWeeklyPercent} />
        </div>

        <div className="bg-white rounded-xl p-4 space-y-4 sm:col-span-4 md:col-span-2">
          <p className="font-bold">Today's Overview</p>
          <hr />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm">New Orders</p>
                <div className="flex gap-2 items-center">
                  <div className="bg-blue-100 py-0.5 px-2 rounded-full">
                    <Box className="w-3 text-blue-700" />
                  </div>
                  <span className="font-semibold text-xl">
                    {data.todayOrders}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm">Pending Payments</p>
                <div className="flex gap-2 items-center">
                  <div className="bg-yellow-100 py-0.5 px-2 rounded-full">
                    <Hourglass className="w-3 text-yellow-700" />
                  </div>
                  <span className="font-semibold text-xl">
                    {data.pendingPayments}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">Daily Revenue</p>
                <div className={`flex items-center justify-between ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-full px-1.5 py-1 gap-1`}>
                  {isPositive ? <MoveUp className="w-4" /> : <MoveDown className="w-4" />}
                  <span className="text-sm">{isPositive && percentValue > 0 ? '+' : ''}{data.revenueDailyPercent}</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="bg-green-100 py-0.5 px-2 rounded-full">
                  <DollarSign className="w-3 text-green-700" />
                </div>
                <span className="font-semibold text-xl">
                  Rp{data.dailyRevenue.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="bg-white rounded-xl px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <Link
              href="/admin/transaction"
              className="hover:bg-gray-50 transition text-gray-700 border border-gray-200 shadow-xs rounded-lg px-3 py-2"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto min-w-[800px] border-collapse text-left">
              <thead className="text-gray-500 text-xs sm:text-sm">
                <tr>
                  <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                    Date
                  </th>
                  <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                    Transaction ID
                  </th>
                  <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                    Customer
                  </th>
                  <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                    Total
                  </th>
                  <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      {formatDate(p.transactionTime)}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      {p.transactionId}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      {p.order.customer.name +
                        ` (${p.order.customer.phoneNumber})`}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Rp{p.grossAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      <span
                        className={`px-2 py-1 capitalize rounded-full font-medium text-xs ${
                          p.transactionStatus === "settlement"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {p.transactionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
