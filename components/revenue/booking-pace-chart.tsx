"use client";

import {
  ChartCard,
  SimpleLineChart,
  LegendItem,
  chartColors,
} from "@/components/shared";

const data = [
  { date: "May 1", current: 125, lastYear: 118 },
  { date: "May 2", current: 142, lastYear: 125 },
  { date: "May 3", current: 168, lastYear: 135 },
  { date: "May 4", current: 195, lastYear: 148 },
  { date: "May 5", current: 228, lastYear: 162 },
  { date: "May 6", current: 265, lastYear: 175 },
  { date: "May 7", current: 298, lastYear: 192 },
  { date: "May 8", current: 335, lastYear: 210 },
  { date: "May 9", current: 372, lastYear: 228 },
  { date: "May 10", current: 405, lastYear: 245 },
  { date: "May 11", current: 438, lastYear: 262 },
  { date: "May 12", current: 468, lastYear: 278 },
  { date: "May 13", current: 495, lastYear: 295 },
  { date: "May 14", current: 520, lastYear: 312 },
];

export function BookingPaceChart() {
  const formatValue = (value: number) => `${value} nights`;

  return (
    <ChartCard
      title="Booking Pace (Last 14 Days)"
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
