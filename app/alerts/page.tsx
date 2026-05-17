"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AlertsTable } from "@/components/alerts/alerts-table";

export default function AlertsPage() {
  return (
    <DashboardShell
      activeItem="alerts"
      title="Alerts & Exceptions"
      subtitle="Monitor and resolve operational alerts across all departments"
    >
      <AlertsTable />
    </DashboardShell>
  );
}
