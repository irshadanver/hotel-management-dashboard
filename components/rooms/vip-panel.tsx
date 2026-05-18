"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, AlertCircle, Cake } from "lucide-react";
import { useVIPGuests } from "@/lib/api/hooks/use-rooms";
import type { RoomFilters } from "@/lib/api/mock/rooms";
import { DataError, DataLoading } from "@/components/shared/data-loading";

const tierStyles = {
  gold: "bg-amber-100 text-amber-700",
  platinum: "bg-slate-200 text-slate-700",
  diamond: "bg-sky-100 text-sky-700",
};

function getRequestIcon(request: string) {
  if (request.toLowerCase().includes("birthday"))
    return <Cake className="h-3 w-3" />;
  if (
    request.toLowerCase().includes("allergy") ||
    request.toLowerCase().includes("halal")
  )
    return <AlertCircle className="h-3 w-3" />;
  return <Gift className="h-3 w-3" />;
}

interface VIPPanelProps {
  filters?: RoomFilters;
}

export function VIPPanel({ filters }: VIPPanelProps) {
  const { data: vipGuests, loading, error } = useVIPGuests(filters);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading VIP guests..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !vipGuests) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load VIP guests"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <CardTitle className="text-base font-semibold">
              VIP Guests & Special Requests
            </CardTitle>
          </div>
          <Badge variant="secondary" className="font-normal">
            {vipGuests.length} guests
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-y-auto">
          <div className="divide-y divide-border">
            {vipGuests.map((guest) => (
              <div key={guest.id} className="px-5 py-3 hover:bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                      {guest.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {guest.name}
                        </span>
                        <Badge
                          className={`${tierStyles[guest.tier]} border-0 text-[10px] font-medium uppercase`}
                        >
                          {guest.tier}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Room {guest.roomNumber}</span>
                        <span>·</span>
                        <span
                          className={
                            guest.checkIn === "May 14"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }
                        >
                          {guest.checkIn === "May 14"
                            ? "Arriving"
                            : "In-House"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 pl-12">
                  {guest.preferences.split(", ").map((request, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {getRequestIcon(request)}
                      {request}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
