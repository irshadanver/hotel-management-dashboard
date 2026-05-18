"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard, LegendItem, chartColors } from "@/components/shared";

const data = [
  { department: "Rooms", revenue: 86500, budget: 82000 },
  { department: "F&B", revenue: 18450, budget: 20000 },
  { department: "Banquet", revenue: 12800, budget: 15000 },
  { department: "Spa", revenue: 8200, budget: 8500 },
  { department: "Other", revenue: 1500, budget: 2000 },
];

export function RevenueByDeptChart() {
  const formatValue = (value: number) => `${(value / 1000).toFixed(0)}K`;

  return (
    <ChartCard
      title="Revenue by Department"
      subtitle="Today's revenue vs budget"
      legend={
        <>
          <LegendItem color={chartColors.success} label="Actual (above budget)" />
          <LegendItem color={chartColors.secondary} label="Actual (below budget)" />
          <LegendItem color={chartColors.muted} label="Budget" />
        </>
      }
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 12, bottom: 8 }}
          barCategoryGap={14}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={formatValue}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="department"
            width={72}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `SAR ${value.toLocaleString()}`,
              name === "revenue" ? "Actual" : "Budget",
            ]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar
            dataKey="revenue"
            fill={chartColors.success}
            name="Actual"
            radius={[0, 4, 4, 0]}
            barSize={14}
          />
          <Bar
            dataKey="budget"
            fill={chartColors.muted}
            name="Budget"
            radius={[0, 4, 4, 0]}
            barSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
