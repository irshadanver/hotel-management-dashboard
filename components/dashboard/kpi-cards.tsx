"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BedDouble,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardKPIs } from "@/lib/api/hooks/use-dashboard";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { DrillDownCard } from "@/components/shared/drill-down-card";
import { DASHBOARD_KPI_ROUTES } from "@/lib/drill-down/routes";
import type { DashboardKPI } from "@/lib/api/mock/dashboard";

const iconMap: Record<string, React.ReactNode> = {
  "Occupancy %": <BedDouble className="h-5 w-5 text-primary" />,
  ADR: <TrendingUp className="h-5 w-5 text-primary" />,
  RevPAR: <Calendar className="h-5 w-5 text-primary" />,
  "Today's Revenue": <DollarSign className="h-5 w-5 text-primary" />,
  "MTD Revenue": <DollarSign className="h-5 w-5 text-primary" />,
  "Cash Position": <Wallet className="h-5 w-5 text-primary" />,
};

function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
}: DashboardKPI & { icon: React.ReactNode }) {
  return (
    <Card className="gap-4 py-5 shadow-sm">
      <CardContent className="p-0 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="break-words text-xl font-semibold tracking-tight text-foreground 2xl:text-2xl">
              {value}
            </p>
            <div className="flex items-center gap-1.5">
              {trend === "up" && (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              )}
              {trend === "down" && (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" && "text-success",
                  trend === "down" && "text-destructive",
                  trend === "neutral" && "text-muted-foreground"
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground">
                {changeLabel}
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  const { data, loading, error } = useDashboardKPIs();

  if (loading) return <DataLoading />;
  if (error || !data) return <DataError message={error?.message ?? "Failed to load KPIs"} />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {data.map((kpi) => {
        const href = DASHBOARD_KPI_ROUTES[kpi.title];
        const card = (
          <KPICard
            key={kpi.title}
            {...kpi}
            icon={iconMap[kpi.title] ?? <DollarSign className="h-5 w-5 text-primary" />}
          />
        );
        return href ? (
          <DrillDownCard
            key={kpi.title}
            href={href}
            ariaLabel={`View details for ${kpi.title}`}
          >
            {card}
          </DrillDownCard>
        ) : (
          card
        );
      })}
    </div>
  );
}
