"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useRoomDepartures } from "@/lib/api/hooks/use-rooms";
import type { RoomFilters } from "@/lib/api/mock/rooms";
import { DataError, DataLoading } from "@/components/shared/data-loading";

const statusStyles = {
  "due-out": "bg-amber-100 text-amber-700",
  "checked-out": "bg-emerald-100 text-emerald-700",
  extended: "bg-red-100 text-red-700",
};

interface DeparturesListProps {
  filters?: RoomFilters;
}

export function DeparturesList({ filters }: DeparturesListProps) {
  const { data: departures, loading, error } = useRoomDepartures(filters);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading departures..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !departures) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load departures"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Departures Today
          </CardTitle>
          <Badge variant="secondary" className="font-normal">
            {departures.length} guests
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-y-auto">
          <div className="divide-y divide-border">
            {departures.map((departure) => (
              <div
                key={departure.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {departure.guestName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      {departure.guestName}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{departure.roomNumber}</span>
                      <span>·</span>
                      <span>{departure.roomType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {departure.balance > 0 && (
                    <span className="text-xs font-medium text-destructive">
                      SAR {departure.balance.toLocaleString()}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{departure.etd}</span>
                  </div>
                  <Badge
                    className={`${statusStyles[departure.status]} border-0 text-xs font-medium`}
                  >
                    {departure.status === "checked-out"
                      ? "Checked Out"
                      : departure.status === "extended"
                        ? "Extended"
                        : "Due Out"}
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
