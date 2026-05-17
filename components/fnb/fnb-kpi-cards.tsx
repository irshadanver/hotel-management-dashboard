"use client";

import {
  DollarSign,
  Users,
  Receipt,
  Percent,
  XCircle,
} from "lucide-react";
import { KPICard, KPICardsGrid } from "@/components/shared";

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
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </KPICardsGrid>
  );
}
