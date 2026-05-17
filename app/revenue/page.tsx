"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RevenueKPICards } from "@/components/revenue/revenue-kpi-cards";
import { RevenueFilters } from "@/components/revenue/revenue-filters";
import { BookingPaceChart } from "@/components/revenue/booking-pace-chart";
import { SegmentRevenueChart } from "@/components/revenue/segment-revenue-chart";
import { ChannelMixChart } from "@/components/revenue/channel-mix-chart";
import { TopAccountsTable } from "@/components/revenue/top-accounts-table";
import { LowDemandTable } from "@/components/revenue/low-demand-table";

/** API_REQUIRED: Revenue module — connect via lib/api/endpoints.ts (revenue.*) */
export default function RevenueDashboard() {
  const [selectedRange, setSelectedRange] = useState("30d");
  const [selectedSegment, setSelectedSegment] = useState("all");

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

      <RevenueKPICards />

      <div className="grid gap-6 lg:grid-cols-2">
        <BookingPaceChart />
        <SegmentRevenueChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChannelMixChart />
        <div className="lg:col-span-2">
          <LowDemandTable />
        </div>
      </div>

      <TopAccountsTable />
    </DashboardShell>
  );
}
