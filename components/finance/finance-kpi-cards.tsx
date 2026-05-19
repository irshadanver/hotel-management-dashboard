"use client";

import { useMemo } from "react";
import {
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { KPICard, KPICardsGrid } from "@/components/shared";
import { DrillDownCard } from "@/components/shared/drill-down-card";
import { FINANCE_KPI_ROUTES } from "@/lib/drill-down/routes";
import { withDrillDateContext } from "@/lib/drill-down/query-params";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { mockNumericScale } from "@/lib/date/preset-multipliers";
import { formatSAR } from "@/lib/types";

const BASE = {
  revenueToday: 127_450,
  cash: 892_340,
  ar: 324_780,
  ap: 156_920,
  openInvoices: 42,
  pendingBills: 18,
};

export function FinanceKPICards() {
  const { rangeQuery } = useGlobalDateFilter();
  const m = mockNumericScale(rangeQuery);

  const kpis = useMemo(() => {
    const s = (n: number) => Math.round(n * m);
    const inv = Math.max(1, Math.round(BASE.openInvoices * (0.92 + 0.08 * m)));
    const bills = Math.max(1, Math.round(BASE.pendingBills * (0.92 + 0.08 * m)));
    return [
      {
        title: "Total Revenue Today",
        value: formatSAR(s(BASE.revenueToday)),
        subtitle: "All departments combined",
        icon: <DollarSign className="h-6 w-6 text-white" />,
        iconBgColor: "oklch(0.55 0.15 145)",
        trend: {
          value: `${m >= 1 ? "+" : ""}${((m - 1) * 100).toFixed(1)}%`,
          positive: m >= 1,
        },
      },
      {
        title: "Cash Balance",
        value: formatSAR(s(BASE.cash)),
        subtitle: "Bank + Cash on hand",
        icon: <Wallet className="h-6 w-6 text-white" />,
        iconBgColor: "oklch(0.55 0.12 250)",
      },
      {
        title: "Accounts Receivable",
        value: formatSAR(s(BASE.ar)),
        subtitle: `${inv} open invoices`,
        icon: <ArrowUpRight className="h-6 w-6 text-white" />,
        iconBgColor: "oklch(0.65 0.15 55)",
        trend: { value: "+12.5%", positive: false },
      },
      {
        title: "Accounts Payable",
        value: formatSAR(s(BASE.ap)),
        subtitle: `${bills} pending bills`,
        icon: <ArrowDownRight className="h-6 w-6 text-white" />,
        iconBgColor: "oklch(0.55 0.15 25)",
      },
    ];
  }, [m]);

  return (
    <KPICardsGrid columns={4}>
      {kpis.map((kpi) => {
        const baseHref = FINANCE_KPI_ROUTES[kpi.title];
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
