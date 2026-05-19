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
  { period: "Current", amount: 124500, count: 18 },
  { period: "1-30 Days", amount: 89200, count: 12 },
  { period: "31-60 Days", amount: 52400, count: 7 },
  { period: "61-90 Days", amount: 34800, count: 4 },
  { period: "90+ Days", amount: 23880, count: 3 },
];

const colors = [
  "oklch(0.55 0.15 145)",
  "oklch(0.55 0.12 250)",
  "oklch(0.65 0.15 55)",
  "oklch(0.60 0.15 35)",
  "oklch(0.55 0.15 25)",
];

export function ARAgingChart() {
  const { tr } = useLocale();
  const { rangeQuery } = useGlobalDateFilter();
  const m = mockNumericScale(rangeQuery);

  const data = useMemo(
    () =>
      BASE.map((row) => ({
        ...row,
        amount: Math.round(row.amount * m),
        count: Math.max(1, Math.round(row.count * (0.9 + 0.1 * m))),
      })),
    [m]
  );

  const totalAR = useMemo(
    () => data.reduce((sum, item) => sum + item.amount, 0),
    [data]
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{tr("Accounts Receivable Aging")}</CardTitle>
            <p className="text-xs text-muted-foreground">{tr("Outstanding by age bracket")}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">SAR {totalAR.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{tr("Total Outstanding")}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "amount" ? `SAR ${value.toLocaleString()}` : value,
                  name === "amount" ? tr("Amount") : tr("Invoices"),
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2 text-center">
          {data.map((item, index) => (
            <div key={item.period} className="rounded-lg bg-muted/30 p-2">
              <div
                className="mx-auto mb-1 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <p className="text-[10px] text-muted-foreground">{item.count} {tr("invoices")}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
