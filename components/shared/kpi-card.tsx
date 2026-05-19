"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale";

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  alert?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = "oklch(0.55 0.12 250)",
  trend,
  alert = false,
  className,
}: KPICardProps) {
  const { tr } = useLocale();

  return (
    <Card className={cn("h-full shadow-sm", className)}>
      <CardContent className="flex h-full min-h-[132px] flex-col justify-between gap-3 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              alert && "ring-2 ring-red-500 ring-offset-2"
            )}
            style={{ backgroundColor: iconBgColor }}
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
              className={cn(
                "flex items-center font-medium",
                trend.positive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export interface KPICardsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function KPICardsGrid({
  children,
  columns = 4,
  className,
}: KPICardsGridProps) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-5",
    6: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div className={cn("grid auto-rows-fr gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}
