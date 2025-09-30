"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function SalesReportChart({ weeklyRevenue, salesData, revenueWeeklyPercent }) {
  const totalWeeklyRevenue = salesData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const bestDay = salesData.reduce(
    (best, current) => (current.revenue > best.revenue ? current : best),
    salesData[0] || { revenue: 0 }
  );

  const percentValue = parseFloat(revenueWeeklyPercent.replace("%", ""));
  const isPositive = percentValue >= 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-lg">Sales Report</p>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
        <div
          className={`flex items-center gap-2 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="text-sm font-medium">
            {isPositive && percentValue > 0 ? '+' : ''}{revenueWeeklyPercent} vs last week
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-bold">Rp{weeklyRevenue}</h3>
        <p className="text-sm text-gray-500">Weekly Revenue</p>
      </div>

      {/* Chart */}
      <div className="h-32 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#16a34a" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-500">Avg/Day</p>
          <p className="font-semibold">
            Rp{Math.round(totalWeeklyRevenue / 7).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Best Day</p>
          <p className="font-semibold">
            Rp{bestDay.revenue.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Growth</p>
          <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-700'}`}>
            {isPositive && percentValue > 0 ? '+' : ''}{revenueWeeklyPercent}
          </p>
        </div>
      </div>
    </>
  );
}
