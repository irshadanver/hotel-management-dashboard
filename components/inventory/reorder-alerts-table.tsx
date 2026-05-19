"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { mockListTakeCount } from "@/lib/date/mock-list-window";

interface ReorderItem {
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  status: "critical" | "low";
}

const reorderItems: ReorderItem[] = [
  { name: "Olive Oil - Extra Virgin", category: "F&B - Kitchen", currentStock: 3, reorderLevel: 10, unit: "L", status: "critical" },
  { name: "Chicken Breast", category: "F&B - Kitchen", currentStock: 8, reorderLevel: 25, unit: "kg", status: "critical" },
  { name: "Bathroom Amenities Set", category: "Housekeeping", currentStock: 45, reorderLevel: 100, unit: "sets", status: "critical" },
  { name: "Printer Paper A4", category: "Admin", currentStock: 5, reorderLevel: 15, unit: "reams", status: "critical" },
  { name: "Fresh Salmon", category: "F&B - Kitchen", currentStock: 4, reorderLevel: 12, unit: "kg", status: "critical" },
  { name: "Cleaning Chemicals", category: "Housekeeping", currentStock: 12, reorderLevel: 20, unit: "L", status: "low" },
  { name: "Bed Linens - King", category: "Housekeeping", currentStock: 18, reorderLevel: 30, unit: "sets", status: "low" },
  { name: "Coffee Beans - Arabic", category: "F&B - Beverage", currentStock: 8, reorderLevel: 15, unit: "kg", status: "low" },
];

export function ReorderAlertsTable() {
  const { tr } = useLocale();
  const { rangeQuery } = useGlobalDateFilter();
  const items = useMemo(
    () => reorderItems.slice(0, mockListTakeCount(reorderItems.length, rangeQuery)),
    [rangeQuery]
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <CardTitle className="text-base font-semibold">{tr("Reorder Alerts")}</CardTitle>
          </div>
          <Badge variant="destructive">{items.length} {tr("items")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 bg-muted/50">
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="w-[34%] px-2 py-2.5">{tr("Item")}</th>
                <th className="w-[21%] px-1.5 py-2.5 text-center">{tr("Current")}</th>
                <th className="w-[21%] px-1.5 py-2.5 text-center">{tr("Reorder")}</th>
                <th className="w-[24%] px-1.5 py-2.5 text-center">{tr("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-muted/30 text-sm transition-colors ${
                    item.status === "critical" ? "bg-red-50/50" : ""
                  }`}
                >
                  <td className="px-2 py-2.5">
                    <div className="min-w-0">
                      <p
                        className="truncate font-medium text-foreground"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{tr(item.category)}</p>
                    </div>
                  </td>
                  <td className="px-1.5 py-2.5 text-center">
                    <span className={`font-semibold tabular-nums ${item.status === "critical" ? "text-red-600" : "text-amber-600"}`}>
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td className="px-1.5 py-2.5 text-center text-muted-foreground tabular-nums">
                    {item.reorderLevel} {item.unit}
                  </td>
                  <td className="px-1.5 py-2.5 text-center">
                    <Badge
                      variant={item.status === "critical" ? "destructive" : "secondary"}
                      className={
                        item.status === "low"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          : "whitespace-nowrap"
                      }
                    >
                      {tr(item.status === "critical" ? "Critical" : "Low")}
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
