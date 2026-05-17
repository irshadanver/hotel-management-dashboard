"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  emptyMessage?: string;
  rowClassName?: (row: T) => string;
  className?: string;
  compact?: boolean;
}

export function DataTable<T>({
  title,
  subtitle,
  icon,
  headerAction,
  columns,
  data,
  rowKey,
  emptyMessage = "No data available",
  rowClassName,
  className,
  compact = false,
}: DataTableProps<T>) {
  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return String(row[rowKey] ?? index);
  };

  const getCellValue = (row: T, key: string): unknown => {
    const keys = key.split(".");
    let value: unknown = row;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value;
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      {(title || headerAction) && (
        <CardHeader className={cn("pb-3", compact && "pb-2")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              {title && (
                <div>
                  <CardTitle className="text-base font-semibold">{title}</CardTitle>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            {headerAction}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={cn(
                      "px-4 font-medium text-muted-foreground",
                      compact ? "py-2" : "py-2.5",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.align !== "center" && col.align !== "right" && "text-left"
                    )}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={getRowKey(row, index)}
                    className={cn(
                      "hover:bg-muted/20",
                      rowClassName?.(row)
                    )}
                  >
                    {columns.map((col) => {
                      const value = getCellValue(row, String(col.key));
                      return (
                        <td
                          key={String(col.key)}
                          className={cn(
                            "px-4",
                            compact ? "py-2.5" : "py-3",
                            col.align === "center" && "text-center",
                            col.align === "right" && "text-right"
                          )}
                        >
                          {col.render ? col.render(value, row) : String(value ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Status badge helper
export interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

export function StatusBadge({
  status,
  config,
  className,
}: {
  status: string;
  config: Record<string, StatusConfig>;
  className?: string;
}) {
  const statusConfig = config[status] ?? { label: status, variant: "outline" as const };
  return (
    <Badge variant={statusConfig.variant} className={cn("text-[10px]", className)}>
      {statusConfig.label}
    </Badge>
  );
}

// Currency formatter helper
export function formatCurrency(
  value: number,
  currency = "SAR",
  options?: Intl.NumberFormatOptions
): string {
  return `${currency} ${value.toLocaleString(undefined, options)}`;
}

// Percentage formatter helper
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
