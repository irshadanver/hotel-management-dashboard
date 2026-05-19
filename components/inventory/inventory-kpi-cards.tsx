"use client";

import { useMemo } from "react";
import {
  Warehouse,
  AlertTriangle,
  FileText,
  TrendingDown,
} from "lucide-react";
import { KPICard, KPICardsGrid } from "@/components/shared";
import { DrillDownCard } from "@/components/shared/drill-down-card";
import { INVENTORY_KPI_ROUTES } from "@/lib/drill-down/routes";
import { withDrillDateContext } from "@/lib/drill-down/query-params";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { mockNumericScale } from "@/lib/date/preset-multipliers";
import { formatSAR } from "@/lib/types";

const BASE = {
  stockValue: 847_250,
  belowReorder: 8,
  pendingPos: 7,
  pendingPoValue: 42_800,
  priceVariance: 4,
};

export function InventoryKPICards() {
  const { rangeQuery } = useGlobalDateFilter();
  const m = mockNumericScale(rangeQuery);

  const kpis = useMemo(() => {
    const s = (n: number) => Math.round(n * m);
    const below = Math.max(1, Math.round(BASE.belowReorder * (1.04 - 0.04 * m)));
    const pos = Math.max(1, Math.round(BASE.pendingPos * (0.92 + 0.08 * m)));
    const variance = Math.max(1, Math.round(BASE.priceVariance * (0.9 + 0.1 * m)));
    return [
      {
        title: "Total Stock Value",
        value: formatSAR(s(BASE.stockValue)),
        subtitle: "Across all stores",
        icon: <Warehouse className="h-6 w-6 text-white" />,
        iconBgColor: "oklch(0.55 0.12 250)",
      },
      {
        title: "Below Reorder Level",
        value: String(below),
        subtitle: "Items need ordering",
        icon: <AlertTriangle className="h-6 w-6 text-white" />,
        iconBgColor: "oklch(0.55 0.15 25)",
        alert: true,
      },
      {
        title: "Pending POs",
        value: String(pos),
        subtitle: `${formatSAR(s(BASE.pendingPoValue))} total`,
        icon: <FileText className="h-6 w-6 text-white" />,
        iconBgColor: "oklch(0.65 0.15 55)",
      },
      {
        title: "Price Variance Alerts",
        value: String(variance),
        subtitle: ">10% from last purchase",
        icon: <TrendingDown className="h-6 w-6 text-white" />,
        iconBgColor: "oklch(0.55 0.15 25)",
        alert: true,
      },
    ];
  }, [m]);

  return (
    <KPICardsGrid columns={4}>
      {kpis.map((kpi) => {
        const baseHref = INVENTORY_KPI_ROUTES[kpi.title];
        const href = baseHref
          ? withDrillDateContext(baseHref, "dashboard", { rangeQuery })
          : undefined;
        const card = <KPICard key={kpi.title} {...kpi} className="h-full" />;

        return href ? (
          <DrillDownCard
            key={kpi.title}
            href={href}
            ariaLabel={`Drill down: ${kpi.title}`}
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
