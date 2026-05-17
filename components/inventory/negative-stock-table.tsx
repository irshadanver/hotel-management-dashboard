"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NegativeStockItem {
  name: string;
  store: string;
  quantity: number;
  unit: string;
  lastTransaction: string;
}

const negativeStockItems: NegativeStockItem[] = [
  { name: "Premium Vodka", store: "Main Bar", quantity: -3, unit: "bottles", lastTransaction: "Today 14:30" },
  { name: "Fresh Milk", store: "Main Kitchen", quantity: -5, unit: "L", lastTransaction: "Today 11:15" },
  { name: "Guest Slippers", store: "Housekeeping", quantity: -12, unit: "pairs", lastTransaction: "Yesterday" },
];

export function NegativeStockTable() {
  return (
    <Card className="shadow-sm ring-2 ring-red-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MinusCircle className="h-4 w-4 text-red-600" />
            <CardTitle className="text-base font-semibold text-red-700">Negative Stock</CardTitle>
          </div>
          <Badge variant="destructive">{negativeStockItems.length} items</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[220px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-red-50">
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5">Item</th>
                <th className="px-4 py-2.5 text-right">Quantity</th>
                <th className="px-4 py-2.5 text-right">Last Txn</th>
              </tr>
            </thead>
            <tbody>
              {negativeStockItems.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-red-100 bg-red-50/30 text-sm"
                >
                  <td className="px-4 py-2.5">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.store}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="font-semibold tabular-nums text-red-600">
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                    {item.lastTransaction}
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
