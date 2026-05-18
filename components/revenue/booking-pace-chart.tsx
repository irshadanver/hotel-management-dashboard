"use client";

import {
  ChartCard,
  SimpleLineChart,
  LegendItem,
  chartColors,
} from "@/components/shared";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useBookingPace } from "@/lib/api/hooks/use-revenue";
import type { RevenueFilters } from "@/lib/api/mock/revenue";

interface BookingPaceChartProps {
  filters?: RevenueFilters;
}

export function BookingPaceChart({ filters }: BookingPaceChartProps) {
  const { data, loading, error } = useBookingPace(filters);
  const formatValue = (value: number) => `${value} nights`;
  const days = filters?.range?.replace("d", "") ?? "30";

  if (loading) return <DataLoading label="Loading booking pace..." />;
  if (error || !data) {
    return <DataError message={error?.message ?? "Failed to load booking pace"} />;
  }

  return (
    <ChartCard
      title={`Booking Pace (Next ${days} Days)`}
      legend={
        <>
          <LegendItem color={chartColors.primary} label="Current Period" />
          <LegendItem color={chartColors.muted} label="Last Year" dashed />
        </>
      }
      height={240}
    >
      <SimpleLineChart
        data={data}
        xAxisKey="date"
        valueFormatter={formatValue}
        height={240}
        lines={[
          { dataKey: "current", color: chartColors.primary, name: "Current Period" },
          { dataKey: "lastYear", color: "#9ca3af", name: "Last Year", dashed: true },
        ]}
      />
    </ChartCard>
  );
}
