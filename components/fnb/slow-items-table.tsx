"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SlowItem {
  name: string;
  category: string;
  quantity: number;
  lastSold: string;
  status: "critical" | "warning";
}

const slowItems: SlowItem[] = [
  { name: "Lobster Thermidor", category: "Main Course", quantity: 1, lastSold: "3 days ago", status: "critical" },
  { name: "Beef Wellington", category: "Main Course", quantity: 2, lastSold: "2 days ago", status: "critical" },
  { name: "Oyster Platter", category: "Starters", quantity: 0, lastSold: "5 days ago", status: "critical" },
  { name: "Duck Confit", category: "Main Course", quantity: 3, lastSold: "Yesterday", status: "warning" },
  { name: "Truffle Risotto", category: "Main Course", quantity: 2, lastSold: "2 days ago", status: "warning" },
  { name: "Tiramisu", category: "Desserts", quantity: 4, lastSold: "Yesterday", status: "warning" },
];

export function SlowItemsTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-amber-600" />
          <CardTitle className="text-base font-semibold">Slow-Moving Items</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[340px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted/50">
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5">Item</th>
                <th className="px-4 py-2.5 text-right">Sold</th>
                <th className="px-4 py-2.5 text-right">Last Sale</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {slowItems.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-muted/30 text-sm transition-colors ${
                    item.status === "critical" ? "bg-red-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">
                    {item.lastSold}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Badge
                      variant={item.status === "critical" ? "destructive" : "secondary"}
                      className={
                        item.status === "warning"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          : ""
                      }
                    >
                      {item.status === "critical" ? "Critical" : "Review"}
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
