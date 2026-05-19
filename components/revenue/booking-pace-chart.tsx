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
import { useLocale } from "@/lib/i18n/locale";

interface BookingPaceChartProps {
  filters?: RevenueFilters;
}

export function BookingPaceChart({ filters }: BookingPaceChartProps) {
  const { data, loading, error } = useBookingPace(filters);
  const { tr } = useLocale();
  const formatValue = (value: number) => `${value} ${tr("nights")}`;
  const days = filters?.range?.replace("d", "") ?? "30";

  if (loading) return <DataLoading label="Loading booking pace..." />;
  if (error || !data) {
    return <DataError message={error?.message ?? "Failed to load booking pace"} />;
  }

  return (
    <ChartCard
      title={`${tr("Booking Pace")} (${tr("Next")} ${days} ${tr("Days")})`}
      legend={
        <>
          <LegendItem color={chartColors.primary} label={tr("Current Period")} />
          <LegendItem color={chartColors.muted} label={tr("Last Year")} dashed />
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
          { dataKey: "current", color: chartColors.primary, name: tr("Current Period") },
          { dataKey: "lastYear", color: "#9ca3af", name: tr("Last Year"), dashed: true },
        ]}
      />
    </ChartCard>
  );
}
