"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { period: "6 AM", breakfast: 450, lunch: 0, dinner: 0 },
  { period: "7 AM", breakfast: 1200, lunch: 0, dinner: 0 },
  { period: "8 AM", breakfast: 2100, lunch: 0, dinner: 0 },
  { period: "9 AM", breakfast: 1800, lunch: 0, dinner: 0 },
  { period: "10 AM", breakfast: 650, lunch: 0, dinner: 0 },
  { period: "11 AM", breakfast: 0, lunch: 320, dinner: 0 },
  { period: "12 PM", breakfast: 0, lunch: 2400, dinner: 0 },
  { period: "1 PM", breakfast: 0, lunch: 3200, dinner: 0 },
  { period: "2 PM", breakfast: 0, lunch: 1800, dinner: 0 },
  { period: "3 PM", breakfast: 0, lunch: 450, dinner: 0 },
  { period: "6 PM", breakfast: 0, lunch: 0, dinner: 1200 },
  { period: "7 PM", breakfast: 0, lunch: 0, dinner: 2800 },
  { period: "8 PM", breakfast: 0, lunch: 0, dinner: 3500 },
  { period: "9 PM", breakfast: 0, lunch: 0, dinner: 2200 },
  { period: "10 PM", breakfast: 0, lunch: 0, dinner: 850 },
];

export function MealPeriodChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Sales by Meal Period</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `SAR ${value.toLocaleString()}`,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              <Line
                type="monotone"
                dataKey="breakfast"
                stroke="oklch(0.65 0.15 55)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="lunch"
                stroke="oklch(0.55 0.12 250)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="dinner"
                stroke="oklch(0.55 0.10 280)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
