"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale";

// Common chart wrapper
interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  legend?: React.ReactNode;
  className?: string;
  height?: number;
}

export function ChartCard({
  title,
  subtitle,
  children,
  legend,
  className,
  height = 280,
}: ChartCardProps) {
  const { tr } = useLocale();

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{tr(title)}</CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{tr(subtitle)}</p>
        )}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>{children}</div>
        {legend && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs">
            {legend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Legend item component
interface LegendItemProps {
  color: string;
  label: string;
  dashed?: boolean;
}

export function LegendItem({ color, label, dashed }: LegendItemProps) {
  const { tr } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("h-2.5 w-2.5 rounded-sm", dashed && "border-2 border-dashed bg-transparent")}
        style={dashed ? { borderColor: color } : { backgroundColor: color }}
      />
      <span className="text-muted-foreground">{tr(label)}</span>
    </div>
  );
}

// Common chart colors
export const chartColors = {
  primary: "oklch(0.55 0.12 250)",
  secondary: "oklch(0.65 0.15 55)",
  success: "oklch(0.55 0.15 145)",
  warning: "oklch(0.70 0.15 85)",
  danger: "oklch(0.55 0.15 25)",
  muted: "#e5e7eb",
  blue: "oklch(0.55 0.12 250)",
  green: "oklch(0.55 0.15 145)",
  amber: "oklch(0.70 0.15 85)",
  red: "oklch(0.55 0.15 25)",
  purple: "oklch(0.55 0.12 300)",
  teal: "oklch(0.55 0.12 180)",
};

// Common tooltip style
export const tooltipStyle = {
  contentStyle: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "12px",
  },
};

// Line Chart Component
export interface LineChartDataPoint {
  [key: string]: string | number;
}

export interface LineConfig {
  dataKey: string;
  color: string;
  name?: string;
  dashed?: boolean;
}

interface SimpleLineChartProps {
  data: LineChartDataPoint[];
  xAxisKey: string;
  lines: LineConfig[];
  valueFormatter?: (value: number) => string;
  height?: number;
}

export function SimpleLineChart({
  data,
  xAxisKey,
  lines,
  valueFormatter = (v) => v.toLocaleString(),
  height = 280,
}: SimpleLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={valueFormatter}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          formatter={(value: number, name: string) => [valueFormatter(value), name]}
          {...tooltipStyle}
        />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            strokeDasharray={line.dashed ? "5 5" : undefined}
            dot={false}
            name={line.name || line.dataKey}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// Bar Chart Component
export interface BarChartDataPoint {
  [key: string]: string | number;
}

export interface BarConfig {
  dataKey: string;
  color: string;
  name?: string;
}

interface SimpleBarChartProps {
  data: BarChartDataPoint[];
  xAxisKey: string;
  bars: BarConfig[];
  layout?: "horizontal" | "vertical";
  valueFormatter?: (value: number) => string;
  height?: number;
  barSize?: number;
  stacked?: boolean;
  /** Same length as data: distinct fill per bar (single-series charts). Enables category legends. */
  cellFills?: string[];
  /** When vertical, width reserved for category labels (outlet names, etc.). */
  categoryAxisWidth?: number;
  /** When vertical, show every category tick (default Recharts can hide some when height is tight). */
  showAllCategoryTicks?: boolean;
  /** When horizontal, angle (degrees) for category labels; reserves bottom margin. */
  categoryTickAngle?: number;
}

export function SimpleBarChart({
  data,
  xAxisKey,
  bars,
  layout = "horizontal",
  valueFormatter = (v) => v.toLocaleString(),
  height = 280,
  barSize = 20,
  stacked = false,
  cellFills,
  categoryAxisWidth,
  showAllCategoryTicks = true,
  categoryTickAngle,
}: SimpleBarChartProps) {
  const isVertical = layout === "vertical";
  const useCells =
    bars.length === 1 &&
    Array.isArray(cellFills) &&
    cellFills.length === data.length;
  const yCatWidth = categoryAxisWidth ?? (isVertical ? 88 : 60);
  const xTickAngle = categoryTickAngle ?? 0;
  const bottomPad = isVertical ? 8 : xTickAngle ? 72 : 8;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={isVertical ? "vertical" : "horizontal"}
        margin={{
          top: 8,
          right: 24,
          left: isVertical ? yCatWidth + 8 : 10,
          bottom: bottomPad,
        }}
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          horizontal={!isVertical}
          vertical={isVertical}
        />
        {isVertical ? (
          <>
            <XAxis
              type="number"
              tickFormatter={valueFormatter}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              interval={showAllCategoryTicks ? 0 : undefined}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              width={yCatWidth}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              interval={showAllCategoryTicks ? 0 : undefined}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              angle={xTickAngle || undefined}
              textAnchor={xTickAngle ? "end" : "middle"}
              height={xTickAngle ? 68 : undefined}
            />
            <YAxis
              tickFormatter={valueFormatter}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
          </>
        )}
        <Tooltip
          formatter={(value: number, name: string) => [valueFormatter(value), name]}
          {...tooltipStyle}
        />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.color}
            radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            barSize={barSize}
            name={bar.name || bar.dataKey}
            stackId={stacked ? "stack" : undefined}
            minPointSize={4}
          >
            {useCells
              ? data.map((_, i) => (
                  <Cell
                    key={`bar-cell-${i}`}
                    fill={cellFills[i] ?? bar.color}
                  />
                ))
              : null}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// Pie/Donut Chart Component
export interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: PieChartDataPoint[];
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (value: number) => string;
  showLabels?: boolean;
  height?: number;
}

export function SimplePieChart({
  data,
  innerRadius = 60,
  outerRadius = 90,
  valueFormatter = (v) => v.toLocaleString(),
  showLabels = false,
  height = 280,
}: SimplePieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          label={showLabels ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : undefined}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [valueFormatter(value), name]}
          {...tooltipStyle}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Area Chart Component
export interface AreaConfig {
  dataKey: string;
  color: string;
  fillOpacity?: number;
  name?: string;
}

interface SimpleAreaChartProps {
  data: LineChartDataPoint[];
  xAxisKey: string;
  areas: AreaConfig[];
  valueFormatter?: (value: number) => string;
  height?: number;
  stacked?: boolean;
}

export function SimpleAreaChart({
  data,
  xAxisKey,
  areas,
  valueFormatter = (v) => v.toLocaleString(),
  height = 280,
  stacked = false,
}: SimpleAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={valueFormatter}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          formatter={(value: number, name: string) => [valueFormatter(value), name]}
          {...tooltipStyle}
        />
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            stroke={area.color}
            fill={area.color}
            fillOpacity={area.fillOpacity ?? 0.3}
            strokeWidth={2}
            stackId={stacked ? "stack" : undefined}
            name={area.name || area.dataKey}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
