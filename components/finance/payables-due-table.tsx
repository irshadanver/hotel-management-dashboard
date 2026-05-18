"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Payable {
  vendor: string;
  amount: number;
  dueDate: string;
  duePeriod: "7days" | "15days" | "30days";
  invoiceCount: number;
}

const payables: Payable[] = [
  { vendor: "Al-Safi Foods", amount: 28000, dueDate: "May 18", duePeriod: "7days", invoiceCount: 3 },
  { vendor: "Premium Linens Co.", amount: 20800, dueDate: "May 20", duePeriod: "7days", invoiceCount: 2 },
  { vendor: "Gulf Beverages", amount: 14620, dueDate: "May 22", duePeriod: "7days", invoiceCount: 2 },
  { vendor: "CleanPro Supplies", amount: 9700, dueDate: "May 26", duePeriod: "15days", invoiceCount: 1 },
  { vendor: "Office World", amount: 7080, dueDate: "May 28", duePeriod: "15days", invoiceCount: 2 },
  { vendor: "Fresh Seafood Trading", amount: 17600, dueDate: "Jun 02", duePeriod: "15days", invoiceCount: 3 },
  { vendor: "Dairy Direct", amount: 11200, dueDate: "Jun 08", duePeriod: "30days", invoiceCount: 2 },
  { vendor: "Tech Solutions LLC", amount: 25720, dueDate: "Jun 12", duePeriod: "30days", invoiceCount: 1 },
  { vendor: "Maintenance Pro", amount: 8200, dueDate: "Jun 15", duePeriod: "30days", invoiceCount: 2 },
  { vendor: "Utility Provider", amount: 14000, dueDate: "Jun 18", duePeriod: "30days", invoiceCount: 1 },
];

const periodConfig = {
  "7days": { label: "7 Days", color: "oklch(0.55 0.15 25)" },
  "15days": { label: "15 Days", color: "oklch(0.65 0.15 55)" },
  "30days": { label: "30 Days", color: "oklch(0.55 0.12 250)" },
};

type SortKey = keyof Pick<Payable, "vendor" | "amount" | "dueDate" | "duePeriod">;
type SortDirection = "asc" | "desc";

const duePeriodOrder = {
  "7days": 1,
  "15days": 2,
  "30days": 3,
};

function SortHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  align?: "left" | "center" | "right";
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => onSort(sortKey)}
      className={`grid h-auto w-full grid-cols-[1fr_12px_30px] items-center gap-1 px-0 py-0 text-xs font-medium ${
        align === "right"
          ? "text-right"
          : align === "center"
            ? "text-center"
            : "text-left"
      }`}
    >
      <span className="truncate">{label}</span>
      <ArrowDownUp className="h-3 w-3" />
      <span className="text-[10px] leading-none">
        {activeKey === sortKey ? (direction === "asc" ? "ASC" : "DESC") : ""}
      </span>
    </Button>
  );
}

export function PayablesDueTable() {
  const [sortKey, setSortKey] = useState<SortKey>("duePeriod");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedPayables = useMemo(() => {
    return [...payables].sort((a, b) => {
      let result: number;

      if (sortKey === "duePeriod") {
        result = duePeriodOrder[a.duePeriod] - duePeriodOrder[b.duePeriod];
      } else if (sortKey === "amount") {
        result = a.amount - b.amount;
      } else {
        result = String(a[sortKey]).localeCompare(String(b[sortKey]));
      }

      return sortDirection === "asc" ? result : -result;
    });
  }, [sortDirection, sortKey]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection(key === "amount" ? "desc" : "asc");
  };

  const groupedPayables = {
    "7days": payables.filter((p) => p.duePeriod === "7days"),
    "15days": payables.filter((p) => p.duePeriod === "15days"),
    "30days": payables.filter((p) => p.duePeriod === "30days"),
  };

  const totals = {
    "7days": groupedPayables["7days"].reduce((sum, p) => sum + p.amount, 0),
    "15days": groupedPayables["15days"].reduce((sum, p) => sum + p.amount, 0),
    "30days": groupedPayables["30days"].reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Payables Due</CardTitle>
          </div>
        </div>
        <div className="mt-2 flex gap-4">
          {(["7days", "15days", "30days"] as const).map((period) => {
            const config = periodConfig[period];
            return (
              <div key={period} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-1.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-xs text-muted-foreground">{config.label}:</span>
                <span className="text-xs font-semibold">SAR {totals[period].toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[280px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  <SortHeader label="Vendor" sortKey="vendor" activeKey={sortKey} direction={sortDirection} onSort={handleSort} />
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                  <SortHeader label="Amount" sortKey="amount" activeKey={sortKey} direction={sortDirection} onSort={handleSort} align="right" />
                </th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">
                  <SortHeader label="Due" sortKey="dueDate" activeKey={sortKey} direction={sortDirection} onSort={handleSort} align="center" />
                </th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">
                  <SortHeader label="Period" sortKey="duePeriod" activeKey={sortKey} direction={sortDirection} onSort={handleSort} align="center" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {sortedPayables.map((payable, index) => {
                const config = periodConfig[payable.duePeriod];
                return (
                  <tr key={index} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <p className="font-medium">{payable.vendor}</p>
                      <p className="text-[10px] text-muted-foreground">{payable.invoiceCount} invoice(s)</p>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      SAR {payable.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{payable.dueDate}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="outline"
                        className="text-[10px] border-0"
                        style={{ backgroundColor: `${config.color}20`, color: config.color }}
                      >
                        {config.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
