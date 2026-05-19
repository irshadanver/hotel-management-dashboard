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
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useMealPeriods } from "@/lib/api/hooks/use-fnb";
import type { FnBFilters } from "@/lib/api/mock/fnb";
import { useLocale } from "@/lib/i18n/locale";

interface MealPeriodChartProps {
  filters?: FnBFilters;
}

export function MealPeriodChart({ filters }: MealPeriodChartProps) {
  const { data, loading, error } = useMealPeriods(filters);
  const { tr } = useLocale();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading meal periods..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load meal periods"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{tr("Sales by Meal Period")}</CardTitle>
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
                  tr(name.charAt(0).toUpperCase() + name.slice(1)),
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
                formatter={(value) => tr(String(value).charAt(0).toUpperCase() + String(value).slice(1))}
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
