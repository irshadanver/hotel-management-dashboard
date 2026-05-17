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

import { useOccupancyForecast } from "@/lib/api/hooks/use-dashboard";
import { DataError, DataLoading } from "@/components/shared/data-loading";

export function OccupancyChart() {
  const { data, loading, error } = useOccupancyForecast();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading />
        </CardContent>
      </Card>
    );
  }
  if (error || !data) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load forecast"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Occupancy Forecast (Next 14 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data as { date: string; forecast: number }[]}>
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
                domain={[60, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.91 0.005 250)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Forecast"]}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="oklch(0.65 0.15 165)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.65 0.15 165)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "oklch(0.65 0.15 165)" }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
