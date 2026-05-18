"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { InventoryKPICards } from "@/components/inventory/inventory-kpi-cards";
import { ReorderAlertsTable } from "@/components/inventory/reorder-alerts-table";
import { SlowMovingTable } from "@/components/inventory/slow-moving-table";
import { NegativeStockTable } from "@/components/inventory/negative-stock-table";
import { StockValueChart } from "@/components/inventory/stock-value-chart";
import { ConsumptionTrendChart } from "@/components/inventory/consumption-trend-chart";
import { PendingPOsPanel } from "@/components/inventory/pending-pos-panel";

/** API_REQUIRED: Inventory module — connect via lib/api/endpoints.ts (inventory.*) */
export default function InventoryPage() {
  return (
    <DashboardShell
      activeItem="inventory"
      title="Inventory & Purchasing"
      subtitle="Stock management and procurement"
    >
      <InventoryKPICards />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <ReorderAlertsTable />
            <NegativeStockTable />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <StockValueChart />
            <ConsumptionTrendChart />
          </div>
          <SlowMovingTable />
        </div>
        <div className="min-h-0 lg:col-span-1">
          <PendingPOsPanel />
        </div>
      </div>
    </DashboardShell>
  );
}
