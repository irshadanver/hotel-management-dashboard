"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Percent,
  DollarSign,
  TrendingUp,
  Calendar,
  CalendarCheck,
} from "lucide-react";
import { DrillDownCard } from "@/components/shared/drill-down-card";
import { REVENUE_KPI_ROUTES } from "@/lib/drill-down/routes";
import { withDrillDateContext } from "@/lib/drill-down/query-params";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useRevenueKPIs } from "@/lib/api/hooks/use-revenue";
import type { RevenueFilters } from "@/lib/api/mock/revenue";
import { useLocale } from "@/lib/i18n/locale";

interface RevenueKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function RevenueKPICard({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}: RevenueKPICardProps) {
  const { tr } = useLocale();

  return (
    <Card className="h-full shadow-sm">
      <CardContent className="flex h-full min-h-[132px] flex-col justify-between gap-3 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <p className="min-w-0 text-sm font-medium leading-snug text-muted-foreground">
            {tr(title)}
          </p>
        </div>

        <p className="break-words text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>

        <div className="flex min-h-4 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {subtitle && <p className="text-muted-foreground">{tr(subtitle)}</p>}
          {trend && (
            <span
              className={`font-medium ${
                trend.positive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const kpiVisuals: Record<string, Pick<RevenueKPICardProps, "icon" | "color">> = {
  "Occupancy Forecast": {
    icon: <Percent className="h-6 w-6 text-white" />,
    color: "oklch(0.55 0.15 250)",
  },
  "ADR Forecast": {
    icon: <DollarSign className="h-6 w-6 text-white" />,
    color: "oklch(0.65 0.15 145)",
  },
  "Room Revenue Forecast": {
    icon: <TrendingUp className="h-6 w-6 text-white" />,
    color: "oklch(0.55 0.12 280)",
  },
  "Pickup (Last 7 Days)": {
    icon: <Calendar className="h-6 w-6 text-white" />,
    color: "oklch(0.65 0.12 165)",
  },
  "Pickup (Today)": {
    icon: <CalendarCheck className="h-6 w-6 text-white" />,
    color: "oklch(0.65 0.15 50)",
  },
};

interface RevenueKPICardsProps {
  filters?: RevenueFilters;
}

export function RevenueKPICards({ filters }: RevenueKPICardsProps) {
  const { data: kpis, loading, error } = useRevenueKPIs(filters);
  const { tr } = useLocale();

  if (loading) return <DataLoading label="Loading revenue KPIs..." />;
  if (error || !kpis) {
    return <DataError message={error?.message ?? "Failed to load revenue KPIs"} />;
  }

  return (
    <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {kpis.map((kpi) => {
        const baseHref = REVENUE_KPI_ROUTES[kpi.title];
        const href = baseHref
          ? withDrillDateContext(baseHref, "revenue", {
              revRange: filters?.range,
              revSegment: filters?.segment,
            })
          : undefined;
        const visual = kpiVisuals[kpi.title] ?? kpiVisuals["Room Revenue Forecast"];
        const card = <RevenueKPICard key={kpi.title} {...kpi} {...visual} />;

        return href ? (
          <DrillDownCard
            key={kpi.title}
            href={href}
            ariaLabel={`${tr("Drill down")}: ${tr(kpi.title)}`}
            className="h-full"
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
