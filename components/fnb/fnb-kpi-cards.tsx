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

const kpis = [
  {
    title: "Today's Sales",
    value: "SAR 18,450",
    subtitle: "All outlets",
    icon: <DollarSign className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.12 250)",
    trend: { value: "+8.2%", positive: true },
  },
  {
    title: "Covers",
    value: "284",
    subtitle: "Guests served today",
    icon: <Users className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.60 0.12 165)",
    trend: { value: "+12%", positive: true },
  },
  {
    title: "Average Check",
    value: "SAR 65",
    subtitle: "Per cover",
    icon: <Receipt className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.10 280)",
    trend: { value: "+3.5%", positive: true },
  },
  {
    title: "Discounts",
    value: "SAR 1,240",
    subtitle: "6.7% of sales",
    icon: <Percent className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.65 0.15 55)",
    trend: { value: "+1.2%", positive: false },
  },
  {
    title: "Voids",
    value: "SAR 320",
    subtitle: "8 transactions",
    icon: <XCircle className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.15 25)",
    trend: { value: "+2", positive: false },
  },
];

export function FnBKPICards() {
  return (
    <KPICardsGrid columns={5}>
      {kpis.map((kpi) => {
        const href = FNB_KPI_ROUTES[kpi.title];
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
