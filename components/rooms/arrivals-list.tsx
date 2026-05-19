"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { useRoomArrivals } from "@/lib/api/hooks/use-rooms";
import type { RoomFilters } from "@/lib/api/mock/rooms";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useLocale } from "@/lib/i18n/locale";

const statusStyles = {
  expected: "bg-amber-100 text-amber-700",
  "checked-in": "bg-emerald-100 text-emerald-700",
  delayed: "bg-red-100 text-red-700",
};

interface ArrivalsListProps {
  filters?: RoomFilters;
}

export function ArrivalsList({ filters }: ArrivalsListProps) {
  const { data: arrivals, loading, error } = useRoomArrivals(filters);
  const { tr } = useLocale();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading arrivals..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !arrivals) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load arrivals"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {tr("Arrivals Today")}
          </CardTitle>
          <Badge variant="secondary" className="font-normal">
            {arrivals.length} {tr("guests")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-y-auto">
          <div className="divide-y divide-border">
            {arrivals.map((arrival) => (
              <div
                key={arrival.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {arrival.guestName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {arrival.guestName}
                      </span>
                      {arrival.isVIP && (
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{arrival.roomNumber}</span>
                      <span>·</span>
                      <span>{tr(arrival.roomType)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{arrival.eta}</span>
                  </div>
                  <Badge
                    className={`${statusStyles[arrival.status]} border-0 text-xs font-medium`}
                  >
                    {arrival.status === "checked-in"
                      ? tr("Checked In")
                      : arrival.status === "delayed"
                        ? tr("Delayed")
                        : tr("Expected")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
