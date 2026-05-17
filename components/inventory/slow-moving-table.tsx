"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-base font-semibold">Slow-Moving Items</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">No movement {">"}21 days</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[280px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted/50">
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5">Item</th>
                <th className="px-4 py-2.5 text-right">Value</th>
                <th className="px-4 py-2.5 text-right">Days</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {slowMovingItems.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-muted/30 text-sm transition-colors ${
                    item.status === "stale" ? "bg-amber-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
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
                      {item.status === "stale" ? "Stale" : "Aging"}
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
