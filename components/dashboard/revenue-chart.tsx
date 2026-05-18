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

import { useRouter } from "next/navigation";
import { useRevenueTrend } from "@/lib/api/hooks/use-dashboard";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { revenueDayHref } from "@/lib/drill-down/routes";

export function RevenueChart() {
  const router = useRouter();
  const { data, loading, error } = useRevenueTrend();

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
          <DataError message={error?.message ?? "Failed to load revenue trend"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Revenue Trend (Last 7 Days)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Click a point to drill down to revenue
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data as { date: string; revenue: number }[]}
              className="cursor-pointer"
              onClick={(state) => {
                const payload = state?.activePayload?.[0]?.payload as
                  | { date: string }
                  | undefined;
                if (payload?.date) {
                  router.push(revenueDayHref(payload.date));
                }
              }}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 250)" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 250)" }}
                tickFormatter={(value) => `${value / 1000}K`}
                dx={-10}
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
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.55 0.14 250)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.55 0.14 250)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "oklch(0.55 0.14 250)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
