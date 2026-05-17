"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { outlet: "Main Restaurant", sales: 8450, color: "oklch(0.55 0.12 250)" },
  { outlet: "Lobby Cafe", sales: 4200, color: "oklch(0.60 0.12 165)" },
  { outlet: "Room Service", sales: 3100, color: "oklch(0.55 0.10 280)" },
  { outlet: "Pool Bar", sales: 1800, color: "oklch(0.65 0.15 55)" },
  { outlet: "Banquet", sales: 900, color: "oklch(0.55 0.12 200)" },
];

export function OutletSalesChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Sales by Outlet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="outlet"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              <Tooltip
                formatter={(value: number) => [`SAR ${value.toLocaleString()}`, "Sales"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
