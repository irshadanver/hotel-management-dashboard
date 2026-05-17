"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface Invoice {
  invoiceNo: string;
  customer: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  severity: "warning" | "critical";
}

const overdueInvoices: Invoice[] = [
  { invoiceNo: "INV-2024-0845", customer: "Gulf Travel Agency", amount: 15200, dueDate: "Feb 10, 2024", daysOverdue: 95, severity: "critical" },
  { invoiceNo: "INV-2024-0867", customer: "Maaden Mining", amount: 18500, dueDate: "Feb 28, 2024", daysOverdue: 72, severity: "critical" },
  { invoiceNo: "INV-2024-0912", customer: "National Water Co.", amount: 16800, dueDate: "Mar 15, 2024", daysOverdue: 62, severity: "critical" },
  { invoiceNo: "INV-2024-0934", customer: "SABIC Corporation", amount: 24500, dueDate: "Apr 02, 2024", daysOverdue: 45, severity: "warning" },
  { invoiceNo: "INV-2024-0956", customer: "Riyadh Chamber", amount: 14200, dueDate: "Apr 10, 2024", daysOverdue: 38, severity: "warning" },
  { invoiceNo: "INV-2024-0978", customer: "Al Faisaliah Group", amount: 11800, dueDate: "Apr 18, 2024", daysOverdue: 32, severity: "warning" },
];

export function OverdueInvoicesTable() {
  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const criticalCount = overdueInvoices.filter((inv) => inv.severity === "critical").length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <CardTitle className="text-base font-semibold">Overdue Invoices</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="text-xs">
              {criticalCount} critical
            </Badge>
            <p className="text-sm font-semibold text-red-600">SAR {totalOverdue.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[280px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Invoice</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {overdueInvoices.map((invoice) => (
                <tr
                  key={invoice.invoiceNo}
                  className={`hover:bg-muted/20 ${
                    invoice.severity === "critical" ? "bg-red-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs">{invoice.invoiceNo}</p>
                    <p className="text-[10px] text-muted-foreground">Due: {invoice.dueDate}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">{invoice.customer}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    SAR {invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={invoice.severity === "critical" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {invoice.daysOverdue}d
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
