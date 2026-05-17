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

interface RoomKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

function RoomKPICard({ title, value, subtitle, icon, color }: RoomKPICardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
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

export function RoomsKPICards() {
  const { data: kpis, loading, error } = useRoomsKPIs();

  if (loading) return <DataLoading />;
  if (error || !kpis) {
    return <DataError message={error?.message ?? "Failed to load room KPIs"} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <RoomKPICard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          subtitle={kpi.subtitle}
          color={kpi.color}
          icon={kpiIcons[kpi.title] ?? <BedDouble className="h-6 w-6 text-white" />}
        />
      ))}
    </div>
  );
}
