"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import {
  DataTable,
  StatusBadge,
  formatCurrency,
  type TableColumn,
  type StatusConfig,
} from "@/components/shared";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { mockNumericScale } from "@/lib/date/preset-multipliers";

interface Debtor {
  rank: number;
  company: string;
  outstanding: number;
  invoices: number;
  oldestDays: number;
  status: "current" | "overdue" | "critical";
}

const debtors: Debtor[] = [
  { rank: 1, company: "Saudi Aramco", outstanding: 48500, invoices: 3, oldestDays: 25, status: "current" },
  { rank: 2, company: "SABIC Corporation", outstanding: 42200, invoices: 2, oldestDays: 45, status: "overdue" },
  { rank: 3, company: "Al Rajhi Holdings", outstanding: 38900, invoices: 4, oldestDays: 18, status: "current" },
  { rank: 4, company: "National Water Co.", outstanding: 31500, invoices: 2, oldestDays: 62, status: "overdue" },
  { rank: 5, company: "Gulf Travel Agency", outstanding: 28700, invoices: 5, oldestDays: 95, status: "critical" },
  { rank: 6, company: "Riyadh Chamber", outstanding: 24300, invoices: 2, oldestDays: 38, status: "overdue" },
  { rank: 7, company: "Ministry of Finance", outstanding: 21800, invoices: 1, oldestDays: 15, status: "current" },
  { rank: 8, company: "Maaden Mining", outstanding: 18500, invoices: 3, oldestDays: 72, status: "critical" },
  { rank: 9, company: "Emaar Properties", outstanding: 15200, invoices: 2, oldestDays: 30, status: "current" },
  { rank: 10, company: "STC Telecom", outstanding: 12400, invoices: 1, oldestDays: 22, status: "current" },
];

const statusConfig: Record<string, StatusConfig> = {
  current: { label: "Current", variant: "outline" },
  overdue: { label: "Overdue", variant: "secondary" },
  critical: { label: "90+ Days", variant: "destructive" },
};

const columns: TableColumn<Debtor>[] = [
  {
    key: "rank",
    header: "#",
    render: (value) => <span className="font-medium text-muted-foreground">{String(value)}</span>,
  },
  {
    key: "company",
    header: "Company",
    render: (value) => <span className="font-medium">{String(value)}</span>,
  },
  {
    key: "outstanding",
    header: "Outstanding",
    align: "right",
    render: (value) => (
      <span className="font-semibold">{formatCurrency(Number(value))}</span>
    ),
  },
  {
    key: "invoices",
    header: "Invoices",
    align: "center",
    render: (value) => <span className="text-muted-foreground">{String(value)}</span>,
  },
  {
    key: "oldestDays",
    header: "Oldest",
    align: "center",
    render: (value) => <span className="text-muted-foreground">{String(value)}d</span>,
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (value) => (
      <StatusBadge status={String(value)} config={statusConfig} />
    ),
  },
];

export function TopDebtorsTable() {
  const { rangeQuery } = useGlobalDateFilter();
  const m = mockNumericScale(rangeQuery);
  const scaledDebtors = useMemo(
    () =>
      debtors.map((d) => ({
        ...d,
        outstanding: Math.round(d.outstanding * m),
        invoices: Math.max(1, Math.round(d.invoices * (0.9 + 0.1 * m))),
        oldestDays: Math.max(1, Math.round(d.oldestDays * (0.95 + 0.05 * m))),
      })),
    [m]
  );
  const totalOutstanding = scaledDebtors.reduce((sum, d) => sum + d.outstanding, 0);

  return (
    <DataTable
      title="Top 10 Debtors"
      icon={<Users className="h-4 w-4 text-primary" />}
      headerAction={
        <p className="text-sm font-semibold">{formatCurrency(totalOutstanding)}</p>
      }
      columns={columns}
      data={scaledDebtors}
      rowKey="rank"
    />
  );
}
