"use client";

import {
  Warehouse,
  AlertTriangle,
  FileText,
  TrendingDown,
} from "lucide-react";
import { KPICard, KPICardsGrid } from "@/components/shared";
import { DrillDownCard } from "@/components/shared/drill-down-card";
import { INVENTORY_KPI_ROUTES } from "@/lib/drill-down/routes";

const kpis = [
  {
    title: "Total Stock Value",
    value: "SAR 847,250",
    subtitle: "Across all stores",
    icon: <Warehouse className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.12 250)",
  },
  {
    title: "Below Reorder Level",
    value: "8",
    subtitle: "Items need ordering",
    icon: <AlertTriangle className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.15 25)",
    alert: true,
  },
  {
    title: "Pending POs",
    value: "7",
    subtitle: "SAR 42,800 total",
    icon: <FileText className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.65 0.15 55)",
  },
  {
    title: "Price Variance Alerts",
    value: "4",
    subtitle: ">10% from last purchase",
    icon: <TrendingDown className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.15 25)",
    alert: true,
  },
];

export function InventoryKPICards() {
  return (
    <KPICardsGrid columns={4}>
      {kpis.map((kpi) => {
        const href = INVENTORY_KPI_ROUTES[kpi.title];
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
