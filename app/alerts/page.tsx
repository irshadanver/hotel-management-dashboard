"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AlertsTable } from "@/components/alerts/alerts-table";
import { DataLoading } from "@/components/shared/data-loading";

type AlertTab = "all" | "critical" | "warning" | "info";

function AlertsPageContent() {
  const searchParams = useSearchParams();
  const severity = searchParams.get("severity") as AlertTab | null;
  const departmentParam = searchParams.get("department");
  const initialTab =
    severity && ["all", "critical", "warning", "info"].includes(severity)
      ? severity
      : "all";
  const initialDepartment = departmentParam
    ? decodeURIComponent(departmentParam)
    : "All Departments";

  return (
    <DashboardShell
      activeItem="alerts"
      title="Alerts & Exceptions"
      subtitle="Monitor and resolve operational alerts across all departments"
    >
      <AlertsTable
        initialTab={initialTab}
        initialDepartment={initialDepartment}
      />
    </DashboardShell>
  );
}

export default function AlertsPage() {
  return (
    <Suspense fallback={<DataLoading label="Loading alerts..." />}>
      <AlertsPageContent />
    </Suspense>
  );
}
