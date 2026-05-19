"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BedDouble,
  CheckCircle,
  Percent,
  LogIn,
  LogOut,
  XCircle,
} from "lucide-react";
import { useRoomsKPIs } from "@/lib/api/hooks/use-rooms";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { DrillDownCard } from "@/components/shared/drill-down-card";
import { ROOMS_KPI_ROUTES } from "@/lib/drill-down/routes";
import { withDrillDateContext } from "@/lib/drill-down/query-params";
import type { RoomFilters } from "@/lib/api/mock/rooms";
import { useLocale } from "@/lib/i18n/locale";

interface RoomKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

function RoomKPICard({ title, value, subtitle, icon, color }: RoomKPICardProps) {
  const { tr } = useLocale();

  return (
    <Card className="h-full shadow-sm">
      <CardContent className="flex h-full min-h-[132px] flex-col gap-2.5 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: color }}
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

        <div className="min-h-4 text-xs">
          {subtitle && <p className="text-muted-foreground">{tr(subtitle)}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const kpiIcons: Record<string, React.ReactNode> = {
  "Rooms Available": <BedDouble className="h-6 w-6 text-white" />,
  "Rooms Sold": <CheckCircle className="h-6 w-6 text-white" />,
  "Occupancy %": <Percent className="h-6 w-6 text-white" />,
  "Arrivals Today": <LogIn className="h-6 w-6 text-white" />,
  "Departures Today": <LogOut className="h-6 w-6 text-white" />,
  "No-Shows": <XCircle className="h-6 w-6 text-white" />,
};

interface RoomsKPICardsProps {
  filters?: RoomFilters;
}

export function RoomsKPICards({ filters }: RoomsKPICardsProps) {
  const { data: kpis, loading, error } = useRoomsKPIs(filters);
  const { tr } = useLocale();

  if (loading) return <DataLoading />;
  if (error || !kpis) {
    return <DataError message={error?.message ?? "Failed to load room KPIs"} />;
  }

  return (
    <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const baseHref = ROOMS_KPI_ROUTES[kpi.title];
        const href = baseHref
          ? withDrillDateContext(baseHref, "rooms", {
              roomsDate: filters?.date,
              roomType: filters?.roomType,
              ...(filters?.date === "header" && filters?.headerRange
                ? { rangeQuery: filters.headerRange }
                : {}),
            })
          : undefined;
        const card = (
          <RoomKPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            color={kpi.color}
            icon={kpiIcons[kpi.title] ?? <BedDouble className="h-6 w-6 text-white" />}
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
    </div>
  );
}
