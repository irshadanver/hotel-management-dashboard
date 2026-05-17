"use client";

import {
  ChartCard,
  SimpleBarChart,
  LegendItem,
  chartColors,
} from "@/components/shared";

const data = [
  { department: "Rooms", revenue: 78500, budget: 72000 },
  { department: "F&B", revenue: 32400, budget: 35000 },
  { department: "Banquet", revenue: 12800, budget: 15000 },
  { department: "Spa", revenue: 8200, budget: 8500 },
  { department: "Other", revenue: 5550, budget: 5000 },
];

export function RevenueByDeptChart() {
  const formatValue = (value: number) => `${(value / 1000).toFixed(0)}K`;

  return (
    <ChartCard
      title="Revenue by Department"
      subtitle="Today's revenue vs budget"
      legend={
        <>
          <LegendItem color={chartColors.success} label="Actual (above budget)" />
          <LegendItem color={chartColors.secondary} label="Actual (below budget)" />
          <LegendItem color={chartColors.muted} label="Budget" />
        </>
      }
    >
      <SimpleBarChart
        data={data}
        xAxisKey="department"
        layout="vertical"
        valueFormatter={formatValue}
        bars={[
          { dataKey: "revenue", color: chartColors.success, name: "Actual" },
          { dataKey: "budget", color: chartColors.muted, name: "Budget" },
        ]}
        height={280}
        barSize={16}
      />
    </ChartCard>
  );
}
