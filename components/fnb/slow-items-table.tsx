"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useSlowItems } from "@/lib/api/hooks/use-fnb";
import type { FnBFilters } from "@/lib/api/mock/fnb";

interface SlowItemsTableProps {
  filters?: FnBFilters;
}

export function SlowItemsTable({ filters }: SlowItemsTableProps) {
  const { data: slowItems, loading, error } = useSlowItems(filters);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading slow items..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !slowItems) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load slow items"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-amber-600" />
          <CardTitle className="text-base font-semibold">Slow-Moving Items</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[340px] overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 bg-muted/50">
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="w-[46%] px-3 py-2.5">Item</th>
                <th className="w-[13%] px-2 py-2.5 text-center">Sold</th>
                <th className="w-[22%] px-2 py-2.5 text-center">Last Sale</th>
                <th className="w-[19%] px-2 py-2.5 text-center">Status</th>
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
                  <td className="px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center font-medium tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-2 py-2.5 text-center text-muted-foreground">
                    {item.lastSold}
                  </td>
                  <td className="px-2 py-2.5 text-center">
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
