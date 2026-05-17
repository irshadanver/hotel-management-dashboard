"use client";

import {
  Warehouse,
  AlertTriangle,
  FileText,
  TrendingDown,
} from "lucide-react";
import { KPICard, KPICardsGrid } from "@/components/shared";

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
    value: "18",
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
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </KPICardsGrid>
  );
}
