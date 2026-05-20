"use client";

import { useCallback, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FnBKPICards } from "@/components/fnb/fnb-kpi-cards";
import { FnBFilters } from "@/components/fnb/fnb-filters";
import { OutletSalesChart } from "@/components/fnb/outlet-sales-chart";
import { MealPeriodChart } from "@/components/fnb/meal-period-chart";
import { TopItemsTable } from "@/components/fnb/top-items-table";
import { SlowItemsTable } from "@/components/fnb/slow-items-table";
import { OpenChecksPanel } from "@/components/fnb/open-checks-panel";
import { StaffMealsPanel } from "@/components/fnb/staff-meals-panel";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { useSyncScreenWithHeader } from "@/lib/date/use-sync-screen-with-header";

/** API_REQUIRED: F&B module — connect via lib/api/endpoints.ts (fnb.*) */
export default function FnBPage() {
  const { rangeQuery } = useGlobalDateFilter();
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedOutlet, setSelectedOutlet] = useState("all");

  useSyncScreenWithHeader(setSelectedDate);

  const handleRefreshFilters = useCallback(() => {
    setSelectedDate("today");
    setSelectedOutlet("all");
  }, []);

  const fnbFilters = useMemo(
    () => ({
      date: selectedDate,
      outlet: selectedOutlet,
      ...(selectedDate === "header" ? { headerRange: rangeQuery } : {}),
    }),
    [selectedDate, selectedOutlet, rangeQuery]
  );

  return (
    <DashboardShell
      activeItem="fnb"
      title="Food & Beverage"
      subtitle="Outlet performance, checks, and menu analytics"
    >
      <FnBFilters
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedOutlet={selectedOutlet}
        onOutletChange={setSelectedOutlet}
        onRefresh={handleRefreshFilters}
      />

      <FnBKPICards filters={fnbFilters} />

      <div className="grid gap-6 lg:grid-cols-2">
        <OutletSalesChart filters={fnbFilters} />
        <MealPeriodChart filters={fnbFilters} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TopItemsTable filters={fnbFilters} />
        <SlowItemsTable filters={fnbFilters} />
        <OpenChecksPanel filters={fnbFilters} />
      </div>

      <StaffMealsPanel filters={fnbFilters} />
    </DashboardShell>
  );
}
