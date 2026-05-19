"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useTopItems } from "@/lib/api/hooks/use-fnb";
import type { FnBFilters } from "@/lib/api/mock/fnb";
import { useLocale } from "@/lib/i18n/locale";

interface TopItemsTableProps {
  filters?: FnBFilters;
}

export function TopItemsTable({ filters }: TopItemsTableProps) {
  const { data: topItems, loading, error } = useTopItems(filters);
  const { tr } = useLocale();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading top items..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !topItems) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load top items"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <CardTitle className="text-base font-semibold">{tr("Top 10 Selling Items")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[340px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted/50">
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5 w-10">#</th>
                <th className="px-4 py-2.5">{tr("Item")}</th>
                <th className="px-4 py-2.5 text-right">{tr("Qty")}</th>
                <th className="px-4 py-2.5 text-right">{tr("Revenue")}</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item, index) => (
                <tr
                  key={item.name}
                  className="border-b border-muted/30 text-sm transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{tr(item.category)}</p>
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
