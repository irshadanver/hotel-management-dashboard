"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { date: "May 15", forecast: 82, confirmed: 78 },
  { date: "May 16", forecast: 85, confirmed: 72 },
  { date: "May 17", forecast: 88, confirmed: 65 },
  { date: "May 18", forecast: 92, confirmed: 58 },
  { date: "May 19", forecast: 90, confirmed: 45 },
  { date: "May 20", forecast: 75, confirmed: 38 },
  { date: "May 21", forecast: 70, confirmed: 32 },
  { date: "May 22", forecast: 78, confirmed: 28 },
  { date: "May 23", forecast: 82, confirmed: 22 },
  { date: "May 24", forecast: 85, confirmed: 18 },
  { date: "May 25", forecast: 90, confirmed: 15 },
  { date: "May 26", forecast: 95, confirmed: 12 },
  { date: "May 27", forecast: 88, confirmed: 8 },
  { date: "May 28", forecast: 80, confirmed: 5 },
];

export function RoomsOccupancyChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Occupancy Forecast (Next 14 Days)
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-4 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-4 rounded-full" style={{ backgroundColor: "oklch(0.65 0.15 145)" }} />
              <span className="text-xs text-muted-foreground">Confirmed</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 250)" }}
                dy={10}
                interval={1}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 250)" }}
                tickFormatter={(value) => `${value}%`}
                dx={-10}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.91 0.005 250)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === "forecast" ? "Forecast" : "Confirmed",
                ]}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="oklch(0.55 0.15 250)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.55 0.15 250)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "oklch(0.55 0.15 250)" }}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="confirmed"
                stroke="oklch(0.65 0.15 145)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.65 0.15 145)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "oklch(0.65 0.15 145)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
