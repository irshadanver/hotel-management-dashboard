"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useDashboardExceptions } from "@/lib/api/hooks/use-dashboard";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { EXCEPTION_ROUTES } from "@/lib/drill-down/routes";
import type { DashboardException } from "@/lib/api/mock/dashboard";
import { useLocale } from "@/lib/i18n/locale";

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
  const { tr } = useLocale();

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
            {tr("Exceptions & Alerts")}
          </CardTitle>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalCount} {tr("Critical")}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          {tr("Click an item to drill down")}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {exceptions.map((exception) => {
          const config = severityConfig[exception.severity];
          const href = EXCEPTION_ROUTES[exception.category];
          const content = (
            <>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className={cn("text-sm font-medium", config.text)}>
                  {tr(exception.category)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tr(exception.description)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-0 font-semibold",
                    config.badgeBg,
                    config.text
                  )}
                >
                  {exception.count}
                </Badge>
                {href && (
                  <ChevronRight className="h-4 w-4 opacity-50" aria-hidden />
                )}
              </div>
            </>
          );
          const className = cn(
            "flex items-center justify-between gap-2 rounded-lg border p-3",
            config.bg,
            config.border,
            href && "cursor-pointer transition-opacity hover:opacity-90"
          );
          if (href) {
            return (
              <Link key={exception.id} href={href} className={className}>
                {content}
              </Link>
            );
          }
          return (
            <div key={exception.id} className={className}>
              {content}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
