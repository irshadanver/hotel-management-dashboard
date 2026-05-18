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
import { useRoomsOccupancyTrend } from "@/lib/api/hooks/use-rooms";
import type { RoomFilters } from "@/lib/api/mock/rooms";
import { DataError, DataLoading } from "@/components/shared/data-loading";

interface RoomsOccupancyChartProps {
  filters?: RoomFilters;
}

export function RoomsOccupancyChart({ filters }: RoomsOccupancyChartProps) {
  const { data, loading, error } = useRoomsOccupancyTrend(filters);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading occupancy trend..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load occupancy trend"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Occupancy Trend
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-4 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Occupancy</span>
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
                formatter={(value: number) => [`${value}%`, "Occupancy"]}
              />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="oklch(0.55 0.15 250)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.55 0.15 250)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "oklch(0.55 0.15 250)" }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
