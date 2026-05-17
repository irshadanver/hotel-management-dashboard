"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { segment: "Corporate", revenue: 485000, color: "oklch(0.55 0.15 250)" },
  { segment: "OTA", revenue: 320000, color: "oklch(0.65 0.15 145)" },
  { segment: "Direct", revenue: 275000, color: "oklch(0.55 0.12 280)" },
  { segment: "Group", revenue: 180000, color: "oklch(0.65 0.15 50)" },
];

export function SegmentRevenueChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Revenue by Segment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barCategoryGap="20%">
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 250)" }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value
                }
              />
              <YAxis
                type="category"
                dataKey="segment"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "oklch(0.4 0.01 250)" }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.91 0.005 250)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [
                  `SAR ${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Bar
                dataKey="revenue"
                fill="oklch(0.55 0.15 250)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
