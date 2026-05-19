"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { mockListTakeCount } from "@/lib/date/mock-list-window";
import { mockNumericScale } from "@/lib/date/preset-multipliers";

interface SlowMovingItem {
  name: string;
  category: string;
  stockValue: number;
  daysSinceUsed: number;
  status: "stale" | "aging";
}

const slowMovingItems: SlowMovingItem[] = [
  { name: "Vintage Wine Reserve", category: "F&B - Beverage", stockValue: 12500, daysSinceUsed: 45, status: "stale" },
  { name: "Specialty Spices Set", category: "F&B - Kitchen", stockValue: 2800, daysSinceUsed: 38, status: "stale" },
  { name: "Premium Caviar", category: "F&B - Kitchen", stockValue: 8400, daysSinceUsed: 32, status: "stale" },
  { name: "Decorative Candles", category: "Housekeeping", stockValue: 1200, daysSinceUsed: 28, status: "aging" },
  { name: "Imported Cheese Selection", category: "F&B - Kitchen", stockValue: 3600, daysSinceUsed: 24, status: "aging" },
  { name: "Event Decorations", category: "Banquet", stockValue: 4500, daysSinceUsed: 21, status: "aging" },
];

export function SlowMovingTable() {
  const { tr } = useLocale();
  const { rangeQuery } = useGlobalDateFilter();
  const m = mockNumericScale(rangeQuery);

  const items = useMemo(() => {
    const take = mockListTakeCount(slowMovingItems.length, rangeQuery);
    return slowMovingItems.slice(0, take).map((row) => ({
      ...row,
      stockValue: Math.round(row.stockValue * m),
      daysSinceUsed: Math.max(1, Math.round(row.daysSinceUsed * (0.95 + 0.05 * m))),
    }));
  }, [rangeQuery, m]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-base font-semibold">{tr("Slow-Moving Items")}</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">{tr("No movement")} {">"}21 {tr("Days").toLowerCase()}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[280px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted/50">
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5">{tr("Item")}</th>
                <th className="px-4 py-2.5 text-right">{tr("Value")}</th>
                <th className="px-4 py-2.5 text-right">{tr("Days")}</th>
                <th className="px-4 py-2.5 text-center">{tr("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-muted/30 text-sm transition-colors ${
                    item.status === "stale" ? "bg-amber-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{tr(item.category)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    SAR {item.stockValue.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-semibold tabular-nums ${item.status === "stale" ? "text-amber-600" : "text-muted-foreground"}`}>
                      {item.daysSinceUsed}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Badge
                      variant="secondary"
                      className={
                        item.status === "stale"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          : ""
                      }
                    >
                      {tr(item.status === "stale" ? "Stale" : "Aging")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
