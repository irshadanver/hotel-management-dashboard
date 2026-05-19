import type { DrillDownDataset } from "@/lib/drill-down/data";
import type { DrillDownChartSpec } from "@/lib/drill-down/chart-spec";
import { parseSarToNumber } from "@/lib/format/sar";
import { outletOptions } from "@/components/shared/filters";

const chartColors = {
  primary: "oklch(0.55 0.12 250)",
  secondary: "oklch(0.65 0.15 55)",
  success: "oklch(0.55 0.15 145)",
  blue: "oklch(0.55 0.12 250)",
  teal: "oklch(0.55 0.12 180)",
  amber: "oklch(0.70 0.15 85)",
  purple: "oklch(0.55 0.12 300)",
};

const categoryPalette = [
  chartColors.primary,
  chartColors.teal,
  chartColors.secondary,
  chartColors.success,
  chartColors.amber,
  chartColors.purple,
  chartColors.blue,
] as const;

function categoryLegendFromLabels(labels: string[]) {
  return labels.map((label, i) => ({
    label,
    color: categoryPalette[i % categoryPalette.length]!,
  }));
}

/** Same order as F&B outlet filter + Sales by Outlet chart. */
function sortFnBBarPoints<T extends { name: string }>(points: T[]): T[] {
  const order = outletOptions
    .filter((o) => o.value !== "all")
    .map((o) => o.label);
  const rank = new Map(order.map((label, i) => [label, i]));
  return [...points].sort(
    (a, b) => (rank.get(a.name) ?? 999) - (rank.get(b.name) ?? 999)
  );
}

function fnbChartAmount(row: Record<string, string | number>): number {
  if (typeof row.valueNum === "number" && Number.isFinite(row.valueNum)) {
    return row.valueNum;
  }
  return parseSarToNumber(String(row.value ?? 0));
}

function fnbCoversChartValue(row: Record<string, string | number>): number {
  if (typeof row.value === "number" && Number.isFinite(row.value)) return row.value;
  return parseInt(String(row.value), 10) || 0;
}

function parsePercent(value: string | number): number {
  if (typeof value === "number") return value;
  const m = String(value).match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

/** Build optional chart spec from dataset shape (no extra mock data). */
export function inferDrillChart(dataset: DrillDownDataset): DrillDownChartSpec | undefined {
  const { domain, view, rows, columns } = dataset;
  if (!rows.length) return undefined;

  const keys = new Set(columns.map((c) => c.key));

  if (domain === "rooms" && view === "occupancy" && keys.has("date") && keys.has("occupancy")) {
    const data = rows.map((r) => ({
      date: String(r.date),
      pct: parsePercent(r.occupancy ?? 0),
    }));
    return {
      kind: "line",
      title: "Occupancy trend",
      subtitle: "From supporting records",
      ariaLabel: "Line chart of occupancy percentage by date",
      xAxisKey: "date",
      lines: [{ dataKey: "pct", color: chartColors.primary, name: "Occupancy %" }],
      data,
      valueFormat: "percent",
    };
  }

  if (
    domain === "rooms" &&
    (view === "sold" || view === "occupied" || view === "available") &&
    keys.has("segment") &&
    keys.has("rooms")
  ) {
    const data = rows.map((r) => ({
      name: String(r.segment),
      value: typeof r.rooms === "number" ? r.rooms : Number(r.rooms) || 0,
    }));
    const categoryLegend = categoryLegendFromLabels(data.map((d) => d.name));
    return {
      kind: "bar",
      title: "Rooms by segment",
      subtitle: "Count per room type",
      ariaLabel: "Column chart of room counts by room type segment",
      layout: "horizontal",
      categoryKey: "name",
      valueKey: "value",
      bars: [{ dataKey: "value", color: chartColors.primary, name: "Rooms" }],
      data,
      valueFormat: "number",
      categoryLegend,
    };
  }

  if (
    domain === "fnb" &&
    ["today-sales", "discounts", "voids"].includes(view) &&
    keys.has("outlet") &&
    keys.has("value")
  ) {
    const data = sortFnBBarPoints(
      rows.map((r) => ({
        name: String(r.outlet),
        value: fnbChartAmount(r),
      }))
    );
    const categoryLegend = categoryLegendFromLabels(data.map((d) => d.name));
    return {
      kind: "bar",
      title: "By outlet",
      subtitle: view === "today-sales" ? "Sales amount" : "Amount",
      ariaLabel: "Bar chart of amounts by outlet",
      layout: "horizontal",
      categoryKey: "name",
      valueKey: "value",
      bars: [{ dataKey: "value", color: chartColors.teal, name: "SAR" }],
      data,
      valueFormat: "currency",
      categoryLegend,
      xCategoryTickAngle: -22,
    };
  }

  if (
    domain === "fnb" &&
    (view === "covers" || view === "average-check") &&
    keys.has("outlet")
  ) {
    const data = sortFnBBarPoints(
      rows.map((r) => ({
        name: String(r.outlet),
        value:
          view === "covers" ? fnbCoversChartValue(r) : fnbChartAmount(r),
      }))
    );
    const categoryLegend = categoryLegendFromLabels(data.map((d) => d.name));
    return {
      kind: "bar",
      title: view === "covers" ? "Covers by outlet" : "Average check by outlet",
      subtitle: "From drill-down table",
      ariaLabel: "Bar chart by outlet",
      layout: "horizontal",
      categoryKey: "name",
      valueKey: "value",
      bars: [
        {
          dataKey: "value",
          color: chartColors.secondary,
          name: view === "covers" ? "Covers" : "SAR",
        },
      ],
      data,
      valueFormat: view === "covers" ? "number" : "currency",
      categoryLegend,
      xCategoryTickAngle: -22,
    };
  }

  if (
    domain === "finance" &&
    view === "accounts-receivable" &&
    keys.has("account") &&
    keys.has("amount")
  ) {
    const data = rows.map((r) => ({
      name: String(r.account),
      value: parseSarToNumber(String(r.amount ?? 0)),
    }));
    const categoryLegend = categoryLegendFromLabels(data.map((d) => d.name));
    return {
      kind: "bar",
      title: "AR by bucket",
      subtitle: "Posted amounts",
      ariaLabel: "Column chart of accounts receivable aging amounts by bucket",
      layout: "horizontal",
      categoryKey: "name",
      valueKey: "value",
      bars: [{ dataKey: "value", color: chartColors.blue, name: "SAR" }],
      data,
      valueFormat: "currency",
      categoryLegend,
      xCategoryTickAngle: -18,
    };
  }

  if (
    domain === "inventory" &&
    view === "stock-value" &&
    keys.has("item") &&
    keys.has("stock")
  ) {
    const palette = [
      chartColors.primary,
      chartColors.secondary,
      chartColors.success,
      chartColors.amber,
      chartColors.purple,
    ];
    const data = rows.map((r, i) => ({
      name: String(r.item),
      value: parseSarToNumber(String(r.stock ?? 0)),
      color: palette[i % palette.length]!,
    }));
    return {
      kind: "pie",
      title: "Stock value mix",
      subtitle: "By category (mock)",
      ariaLabel: "Pie chart of stock value by inventory line",
      slices: data.map((d) => ({ name: d.name, value: d.value, color: d.color })),
      valueFormat: "currency",
    };
  }

  return undefined;
}
