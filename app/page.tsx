"use client";

import { KPICards } from "@/components/dashboard/kpi-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
import { ArrivalsTable } from "@/components/dashboard/arrivals-table";
import { DeparturesTable } from "@/components/dashboard/departures-table";
import { ExceptionsPanel } from "@/components/dashboard/exceptions-panel";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardPage() {
  return (
    <DashboardShell
      activeItem="dashboard"
      title="Executive Dashboard"
      subtitle="Real-time performance metrics and operational insights"
      rightPanel={<ExceptionsPanel />}
    >
      <KPICards />

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <OccupancyChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ArrivalsTable />
        <DeparturesTable />
      </div>
    </DashboardShell>
  );
}
