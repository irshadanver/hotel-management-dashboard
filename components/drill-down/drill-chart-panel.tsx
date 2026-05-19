"use client";

import {
  ChartCard,
  LegendItem,
  SimpleBarChart,
  SimpleLineChart,
  SimplePieChart,
  type PieChartDataPoint,
} from "@/components/shared/charts";
import { formatSAR } from "@/lib/types";
import type { DrillDownChartSpec } from "@/lib/drill-down/chart-spec";

function valueFormatter(
  format: DrillDownChartSpec["valueFormat"]
): (v: number) => string {
  if (format === "percent") return (v) => `${Math.round(v)}%`;
  if (format === "currency") return (v) => formatSAR(Math.round(v));
  return (v) => v.toLocaleString();
}

export function DrillDownChartPanel({ spec }: { spec: DrillDownChartSpec }) {
  const fmt = valueFormatter(spec.valueFormat);

  if (spec.kind === "line") {
    const legend =
      spec.lines.length > 0 ? (
        <>
          {spec.lines.map((line) => (
            <LegendItem
              key={line.dataKey}
              color={line.color}
              label={line.name || line.dataKey}
              dashed={line.dashed}
            />
          ))}
        </>
      ) : undefined;

    return (
      <ChartCard
        title={spec.title}
        subtitle={spec.subtitle}
        height={legend ? 300 : 260}
        legend={legend}
      >
        <div role="img" aria-label={spec.ariaLabel}>
          <SimpleLineChart
            data={spec.data}
            xAxisKey={spec.xAxisKey}
            lines={spec.lines}
            valueFormatter={fmt}
            height={legend ? 248 : 240}
          />
        </div>
      </ChartCard>
    );
  }

  if (spec.kind === "bar") {
    const categoryLegend = spec.categoryLegend;
    const cellFills =
      categoryLegend &&
      categoryLegend.length === spec.data.length &&
      spec.bars.length === 1
        ? categoryLegend.map((c) => c.color)
        : undefined;

    const legend =
      categoryLegend && categoryLegend.length > 0 ? (
        <>
          {categoryLegend.map((item, i) => (
            <LegendItem
              key={`${item.label}-${i}`}
              color={item.color}
              label={item.label}
            />
          ))}
        </>
      ) : undefined;

    const isVertical = spec.layout === "vertical";
    const plotHeight = isVertical
      ? Math.min(640, Math.max(220, spec.data.length * 44 + 64))
      : Math.max(300, Math.min(420, 140 + spec.data.length * 44));

    const tickAngle =
      spec.kind === "bar" && spec.xCategoryTickAngle != null
        ? spec.xCategoryTickAngle
        : undefined;

    return (
      <ChartCard
        title={spec.title}
        subtitle={spec.subtitle}
        height={plotHeight + (legend ? 8 : 0)}
        legend={legend}
      >
        <div role="img" aria-label={spec.ariaLabel}>
          <SimpleBarChart
            data={spec.data}
            xAxisKey={spec.categoryKey}
            bars={spec.bars}
            layout={spec.layout}
            valueFormatter={fmt}
            height={plotHeight}
            barSize={
              spec.layout === "vertical"
                ? Math.min(26, Math.max(18, Math.floor((plotHeight - 56) / Math.max(spec.data.length, 1) - 6)))
                : Math.min(32, Math.max(20, Math.floor(280 / Math.max(spec.data.length, 1) - 4)))
            }
            cellFills={cellFills}
            categoryAxisWidth={isVertical ? 96 : undefined}
            showAllCategoryTicks
            categoryTickAngle={tickAngle}
          />
        </div>
      </ChartCard>
    );
  }

  const pieData: PieChartDataPoint[] = spec.slices.map((s) => ({
    name: s.name,
    value: s.value,
    color: s.color,
  }));

  return (
    <ChartCard title={spec.title} subtitle={spec.subtitle} height={300}>
      <div role="img" aria-label={spec.ariaLabel}>
        <SimplePieChart
          data={pieData}
          valueFormatter={fmt}
          showLabels
          height={260}
        />
      </div>
    </ChartCard>
  );
}
