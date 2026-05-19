"use client";

import { useMemo } from "react";
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
import { useLocale } from "@/lib/i18n/locale";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { mockNumericScale } from "@/lib/date/preset-multipliers";

const BASE = [
  { store: "Main Kitchen", value: 285000, color: "oklch(0.55 0.12 250)" },
  { store: "Housekeeping", value: 198000, color: "oklch(0.60 0.12 165)" },
  { store: "Main Bar", value: 145000, color: "oklch(0.55 0.10 280)" },
  { store: "Pool Bar", value: 68000, color: "oklch(0.65 0.15 55)" },
  { store: "Admin Store", value: 52000, color: "oklch(0.50 0.08 240)" },
  { store: "Banquet", value: 99250, color: "oklch(0.58 0.10 200)" },
];

export function StockValueChart() {
  const { tr } = useLocale();
  const { rangeQuery } = useGlobalDateFilter();
  const m = mockNumericScale(rangeQuery);

  const data = useMemo(
    () =>
      BASE.map((row) => ({
        ...row,
        value: Math.round(row.value * m),
      })),
    [m]
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{tr("Stock Value by Store")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="store"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [`SAR ${value.toLocaleString()}`, tr("Value")]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
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
