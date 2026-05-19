"use client";

import Link from "next/link";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RevenueKPICards } from "@/components/revenue/revenue-kpi-cards";
import { RevenueFilters } from "@/components/revenue/revenue-filters";
import { BookingPaceChart } from "@/components/revenue/booking-pace-chart";
import { SegmentRevenueChart } from "@/components/revenue/segment-revenue-chart";
import { ChannelMixChart } from "@/components/revenue/channel-mix-chart";
import { TopAccountsTable } from "@/components/revenue/top-accounts-table";
import { LowDemandTable } from "@/components/revenue/low-demand-table";
import { drillDownHref } from "@/lib/drill-down/routes";
import { withDrillDateContext } from "@/lib/drill-down/query-params";

/** API_REQUIRED: Revenue module — connect via lib/api/endpoints.ts (revenue.*) */
export default function RevenueDashboard() {
  const [selectedRange, setSelectedRange] = useState("30d");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const revenueFilters = {
    range: selectedRange,
    segment: selectedSegment,
  };

  const cashPositionDrillHref = withDrillDateContext(
    drillDownHref("finance", "cash-position"),
    "revenue",
    { revRange: selectedRange, revSegment: selectedSegment }
  );

  return (
    <DashboardShell
      activeItem="revenue"
      title="Revenue & Booking Pace"
      subtitle="Track booking pace, revenue forecasts, and channel performance"
    >
      <RevenueFilters
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        selectedSegment={selectedSegment}
        onSegmentChange={setSelectedSegment}
      />

      <RevenueKPICards filters={revenueFilters} />

      <p className="text-xs text-muted-foreground">
        <Link
          href={cashPositionDrillHref}
          className="text-primary underline-offset-2 hover:underline"
        >
          Cash position drill-down
        </Link>
        <span className="ms-1">(uses the revenue range and segment filters above)</span>
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <BookingPaceChart filters={revenueFilters} />
        <SegmentRevenueChart filters={revenueFilters} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(340px,1fr)_minmax(0,1.45fr)]">
        <ChannelMixChart filters={revenueFilters} />
        <div className="min-w-0">
          <LowDemandTable filters={revenueFilters} />
        </div>
      </div>

      <TopAccountsTable filters={revenueFilters} />
    </DashboardShell>
  );
}
