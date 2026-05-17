"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface Payable {
  vendor: string;
  amount: number;
  dueDate: string;
  duePeriod: "7days" | "15days" | "30days";
  invoiceCount: number;
}

const payables: Payable[] = [
  { vendor: "Al-Safi Foods", amount: 24500, dueDate: "May 18", duePeriod: "7days", invoiceCount: 3 },
  { vendor: "Premium Linens Co.", amount: 18200, dueDate: "May 20", duePeriod: "7days", invoiceCount: 2 },
  { vendor: "Gulf Beverages", amount: 12800, dueDate: "May 22", duePeriod: "7days", invoiceCount: 2 },
  { vendor: "CleanPro Supplies", amount: 8500, dueDate: "May 26", duePeriod: "15days", invoiceCount: 1 },
  { vendor: "Office World", amount: 6200, dueDate: "May 28", duePeriod: "15days", invoiceCount: 2 },
  { vendor: "Fresh Seafood Trading", amount: 15400, dueDate: "Jun 02", duePeriod: "15days", invoiceCount: 3 },
  { vendor: "Dairy Direct", amount: 9800, dueDate: "Jun 08", duePeriod: "30days", invoiceCount: 2 },
  { vendor: "Tech Solutions LLC", amount: 22500, dueDate: "Jun 12", duePeriod: "30days", invoiceCount: 1 },
  { vendor: "Maintenance Pro", amount: 7200, dueDate: "Jun 15", duePeriod: "30days", invoiceCount: 2 },
];

const periodConfig = {
  "7days": { label: "7 Days", color: "oklch(0.55 0.15 25)" },
  "15days": { label: "15 Days", color: "oklch(0.65 0.15 55)" },
  "30days": { label: "30 Days", color: "oklch(0.55 0.12 250)" },
};

export function PayablesDueTable() {
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
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Vendor</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">Due</th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {payables.map((payable, index) => {
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
