"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter } from "next/navigation";
import { useRoomsOccupancyTrend } from "@/lib/api/hooks/use-rooms";
import type { RoomFilters } from "@/lib/api/mock/rooms";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { occupancyForecastHref } from "@/lib/drill-down/routes";
import { useLocale } from "@/lib/i18n/locale";

interface RoomsOccupancyChartProps {
  filters?: RoomFilters;
}

export function RoomsOccupancyChart({ filters }: RoomsOccupancyChartProps) {
  const router = useRouter();
  const { data, loading, error } = useRoomsOccupancyTrend(filters);
  const { tr } = useLocale();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading occupancy forecast..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load occupancy forecast"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          {tr("Occupancy Forecast (Next 14 Days)")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {tr("Click a point to drill down to rooms")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              className="cursor-pointer"
              onClick={(state) => {
                const payload = state?.activePayload?.[0]?.payload as
                  | { date: string }
                  | undefined;
                router.push(occupancyForecastHref(payload?.date));
              }}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 250)" }}
                dy={10}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 250)" }}
                tickFormatter={(value) => `${value}%`}
                dx={-10}
                domain={[55, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.91 0.005 250)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [`${value}%`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                name={tr("Forecast %")}
                dataKey="forecast"
                stroke="oklch(0.65 0.15 165)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.65 0.15 165)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "oklch(0.65 0.15 165)" }}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                name={tr("Confirmed %")}
                dataKey="confirmed"
                stroke="oklch(0.55 0.15 250)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.55 0.15 250)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "oklch(0.55 0.15 250)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
