"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDashboardExceptions } from "@/lib/api/hooks/use-dashboard";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import type { DashboardException } from "@/lib/api/mock/dashboard";

const severityConfig: Record<
  DashboardException["severity"],
  { bg: string; text: string; border: string; badgeBg: string }
> = {
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    badgeBg: "bg-red-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    badgeBg: "bg-amber-100",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    badgeBg: "bg-emerald-100",
  },
};

export function ExceptionsPanel() {
  const { data: exceptions, loading, error } = useDashboardExceptions();

  if (loading) return <DataLoading />;
  if (error || !exceptions) {
    return <DataError message={error?.message ?? "Failed to load exceptions"} />;
  }

  const criticalCount = exceptions.filter((e) => e.severity === "red").length;

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Exceptions & Alerts
          </CardTitle>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalCount} Critical
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {exceptions.map((exception) => {
          const config = severityConfig[exception.severity];
          return (
            <div
              key={exception.id}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3",
                config.bg,
                config.border
              )}
            >
              <div className="space-y-0.5">
                <p className={cn("text-sm font-medium", config.text)}>
                  {exception.category}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exception.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 border-0 font-semibold",
                  config.badgeBg,
                  config.text
                )}
              >
                {exception.count}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
