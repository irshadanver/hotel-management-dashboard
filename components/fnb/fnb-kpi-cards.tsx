"use client";

import {
  DollarSign,
  Users,
  Receipt,
  Percent,
  XCircle,
} from "lucide-react";
import { KPICard, KPICardsGrid } from "@/components/shared";
import { DrillDownCard } from "@/components/shared/drill-down-card";
import { FNB_KPI_ROUTES } from "@/lib/drill-down/routes";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useFnBKPIs } from "@/lib/api/hooks/use-fnb";
import type { FnBFilters } from "@/lib/api/mock/fnb";
import { useLocale } from "@/lib/i18n/locale";

const kpiVisuals = {
  "Today's Sales": {
    icon: <DollarSign className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.12 250)",
  },
  Covers: {
    icon: <Users className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.60 0.12 165)",
  },
  "Average Check": {
    icon: <Receipt className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.10 280)",
  },
  Discounts: {
    icon: <Percent className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.65 0.15 55)",
  },
  Voids: {
    icon: <XCircle className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.15 25)",
  },
};

interface FnBKPICardsProps {
  filters?: FnBFilters;
}

export function FnBKPICards({ filters }: FnBKPICardsProps) {
  const { data: kpis, loading, error } = useFnBKPIs(filters);
  const { tr } = useLocale();

  if (loading) return <DataLoading label="Loading F&B KPIs..." />;
  if (error || !kpis) {
    return <DataError message={error?.message ?? "Failed to load F&B KPIs"} />;
  }

  return (
    <KPICardsGrid columns={5}>
      {kpis.map((kpi) => {
        const href = FNB_KPI_ROUTES[kpi.title];
        const visual = kpiVisuals[kpi.title as keyof typeof kpiVisuals];
        const card = (
          <KPICard
            key={kpi.title}
            {...kpi}
            {...visual}
            className="h-full"
          />
        );

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
    </KPICardsGrid>
  );
}
