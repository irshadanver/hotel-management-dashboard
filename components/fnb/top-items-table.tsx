"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface TopItem {
  rank: number;
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

const topItems: TopItem[] = [
  { rank: 1, name: "Arabic Breakfast Platter", category: "Breakfast", quantity: 42, revenue: 2520 },
  { rank: 2, name: "Grilled Lamb Chops", category: "Main Course", quantity: 28, revenue: 2240 },
  { rank: 3, name: "Fresh Orange Juice", category: "Beverages", quantity: 86, revenue: 1290 },
  { rank: 4, name: "Club Sandwich", category: "All Day Dining", quantity: 35, revenue: 1225 },
  { rank: 5, name: "Chicken Shawarma", category: "Main Course", quantity: 38, revenue: 1140 },
  { rank: 6, name: "Arabic Coffee", category: "Beverages", quantity: 124, revenue: 992 },
  { rank: 7, name: "Caesar Salad", category: "Starters", quantity: 31, revenue: 930 },
  { rank: 8, name: "Hummus & Bread", category: "Starters", quantity: 52, revenue: 780 },
  { rank: 9, name: "Kunafa", category: "Desserts", quantity: 28, revenue: 700 },
  { rank: 10, name: "Mango Smoothie", category: "Beverages", quantity: 45, revenue: 675 },
];

export function TopItemsTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <CardTitle className="text-base font-semibold">Top 10 Selling Items</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[340px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted/50">
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5 w-10">#</th>
                <th className="px-4 py-2.5">Item</th>
                <th className="px-4 py-2.5 text-right">Qty</th>
                <th className="px-4 py-2.5 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item) => (
                <tr
                  key={item.rank}
                  className="border-b border-muted/30 text-sm transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums text-foreground">
                    SAR {item.revenue.toLocaleString()}
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
