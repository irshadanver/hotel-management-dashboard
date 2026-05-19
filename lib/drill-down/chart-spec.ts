export type DrillDownChartKind = "line" | "bar" | "pie";

export type DrillDownValueFormat = "currency" | "number" | "percent";

export type DrillDownChartSpec =
  | {
      kind: "line";
      title: string;
      subtitle?: string;
      ariaLabel: string;
      xAxisKey: string;
      lines: { dataKey: string; color: string; name?: string; dashed?: boolean }[];
      data: Record<string, string | number>[];
      valueFormat: DrillDownValueFormat;
    }
  | {
      kind: "bar";
      title: string;
      subtitle?: string;
      ariaLabel: string;
      layout: "horizontal" | "vertical";
      categoryKey: string;
      valueKey: string;
      bars: { dataKey: string; color: string; name?: string }[];
      data: Record<string, string | number>[];
      valueFormat: DrillDownValueFormat;
      /** One entry per row (same order as data): color swatch + label for room types, outlets, etc. */
      categoryLegend?: { label: string; color: string }[];
      /** Angled category labels on horizontal bars (outlet names, etc.). */
      xCategoryTickAngle?: number;
    }
  | {
      kind: "pie";
      title: string;
      subtitle?: string;
      ariaLabel: string;
      slices: { name: string; value: number; color: string }[];
      valueFormat: DrillDownValueFormat;
    };
