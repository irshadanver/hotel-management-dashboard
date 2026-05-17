"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Percent,
  DollarSign,
  TrendingUp,
  Calendar,
  CalendarCheck,
} from "lucide-react";

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
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.positive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend.positive ? "+" : ""}
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenueKPICards() {
  const kpis: RevenueKPICardProps[] = [
    {
      title: "Occupancy Forecast",
      value: "78.5%",
      subtitle: "Next 30 days",
      icon: <Percent className="h-6 w-6 text-white" />,
      color: "oklch(0.55 0.15 250)",
      trend: { value: "2.3%", positive: true },
    },
    {
      title: "ADR Forecast",
      value: "SAR 485",
      subtitle: "Next 30 days",
      icon: <DollarSign className="h-6 w-6 text-white" />,
      color: "oklch(0.65 0.15 145)",
      trend: { value: "3.1%", positive: true },
    },
    {
      title: "Room Revenue Forecast",
      value: "SAR 2.4M",
      subtitle: "Next 30 days",
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      color: "oklch(0.55 0.12 280)",
      trend: { value: "5.8%", positive: true },
    },
    {
      title: "Pickup (Last 7 Days)",
      value: "342",
      subtitle: "Room nights booked",
      icon: <Calendar className="h-6 w-6 text-white" />,
      color: "oklch(0.65 0.12 165)",
      trend: { value: "12%", positive: true },
    },
    {
      title: "Pickup (Today)",
      value: "58",
      subtitle: "Room nights booked",
      icon: <CalendarCheck className="h-6 w-6 text-white" />,
      color: "oklch(0.65 0.15 50)",
      trend: { value: "8%", positive: true },
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {kpis.map((kpi) => (
        <RevenueKPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}
