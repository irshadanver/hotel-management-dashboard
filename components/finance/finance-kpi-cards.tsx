"use client";

import {
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { KPICard, KPICardsGrid } from "@/components/shared";
import { DrillDownCard } from "@/components/shared/drill-down-card";
import { FINANCE_KPI_ROUTES } from "@/lib/drill-down/routes";

const kpis = [
  {
    title: "Total Revenue Today",
    value: "SAR 127,450",
    subtitle: "All departments combined",
    icon: <DollarSign className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.15 145)",
    trend: { value: "+8.2%", positive: true },
  },
  {
    title: "Cash Balance",
    value: "SAR 892,340",
    subtitle: "Bank + Cash on hand",
    icon: <Wallet className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.12 250)",
  },
  {
    title: "Accounts Receivable",
    value: "SAR 324,780",
    subtitle: "42 open invoices",
    icon: <ArrowUpRight className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.65 0.15 55)",
    trend: { value: "+12.5%", positive: false },
  },
  {
    title: "Accounts Payable",
    value: "SAR 156,920",
    subtitle: "18 pending bills",
    icon: <ArrowDownRight className="h-6 w-6 text-white" />,
    iconBgColor: "oklch(0.55 0.15 25)",
  },
];

export function FinanceKPICards() {
  return (
    <KPICardsGrid columns={4}>
      {kpis.map((kpi) => {
        const href = FINANCE_KPI_ROUTES[kpi.title];
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
