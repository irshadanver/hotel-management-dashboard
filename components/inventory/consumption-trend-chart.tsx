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
  { date: "Week 1", food: 42000, beverage: 18000, supplies: 12000 },
  { date: "Week 2", food: 38000, beverage: 21000, supplies: 8500 },
  { date: "Week 3", food: 45000, beverage: 19500, supplies: 14000 },
  { date: "Week 4", food: 41000, beverage: 22000, supplies: 9200 },
  { date: "Week 5", food: 48000, beverage: 24000, supplies: 11000 },
  { date: "Week 6", food: 44000, beverage: 20500, supplies: 10500 },
];

export function ConsumptionTrendChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Stock Consumption Trend</CardTitle>
          <span className="text-xs text-muted-foreground">Last 6 weeks</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`SAR ${value.toLocaleString()}`, ""]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="food"
                name="Food"
                stroke="oklch(0.55 0.12 250)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="beverage"
                name="Beverage"
                stroke="oklch(0.60 0.12 165)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="supplies"
                name="Supplies"
                stroke="oklch(0.65 0.15 55)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
