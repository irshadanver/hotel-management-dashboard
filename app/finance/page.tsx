"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FinanceKPICards } from "@/components/finance/finance-kpi-cards";
import { RevenueByDeptChart } from "@/components/finance/revenue-by-dept-chart";
import { ARAgingChart } from "@/components/finance/ar-aging-chart";
import { TopDebtorsTable } from "@/components/finance/top-debtors-table";
import { OverdueInvoicesTable } from "@/components/finance/overdue-invoices-table";
import { PayablesDueTable } from "@/components/finance/payables-due-table";
import { FinanceAlertsPanel } from "@/components/finance/finance-alerts-panel";

/** API_REQUIRED: Finance module — connect via lib/api/endpoints.ts (finance.*) */
export default function FinancePage() {
  return (
    <DashboardShell
      activeItem="finance"
      title="Finance Dashboard"
      subtitle="Financial overview and accounts management"
    >
      <FinanceKPICards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueByDeptChart />
        <ARAgingChart />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="space-y-6 xl:col-span-3">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TopDebtorsTable />
            <OverdueInvoicesTable />
          </div>
          <PayablesDueTable />
        </div>
        <div className="xl:col-span-1">
          <FinanceAlertsPanel />
        </div>
      </div>
    </DashboardShell>
  );
}
