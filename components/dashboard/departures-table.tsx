"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardDepartures } from "@/lib/api/hooks/use-dashboard";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { DetailDrawer } from "@/components/detail/detail-drawer";
import { GuestDetailPanel } from "@/components/detail/guest-detail-panel";

const statusConfig = {
  "checked-out": { label: "Checked Out", variant: "default" as const },
  pending: { label: "Pending", variant: "secondary" as const },
  overdue: { label: "Overdue", variant: "destructive" as const },
};

export function DeparturesTable() {
  const { data: departures, loading, error } = useDashboardDepartures();
  const [guestOpen, setGuestOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<{
    guestName: string;
    room: string;
    balance: number;
    status: string;
  } | null>(null);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading />
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
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Departures Today
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Click a row to drill down
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {departures.length} Guests
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                    Guest Name
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                    Room
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                    Balance
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {departures.map((departure) => {
                  const config = statusConfig[departure.status];
                  return (
                    <tr
                      key={departure.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedGuest({
                          guestName: departure.guestName,
                          room: departure.room,
                          balance: departure.balance,
                          status: config.label,
                        });
                        setGuestOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedGuest({
                            guestName: departure.guestName,
                            room: departure.room,
                            balance: departure.balance,
                            status: config.label,
                          });
                          setGuestOpen(true);
                        }
                      }}
                      className="cursor-pointer border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 text-sm font-medium">
                        {departure.guestName}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {departure.room}
                      </td>
                      <td className="py-3 text-sm">
                        <span
                          className={
                            departure.balance > 0
                              ? "font-medium text-destructive"
                              : "text-muted-foreground"
                          }
                        >
                          SAR {departure.balance.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <DetailDrawer
        open={guestOpen}
        onOpenChange={setGuestOpen}
        title="Departure details"
        description="Guest drill-down"
      >
        {selectedGuest && (
          <GuestDetailPanel
            guest={{
              guestName: selectedGuest.guestName,
              room: selectedGuest.room,
              balance: selectedGuest.balance,
              status: selectedGuest.status,
            }}
            context="departure"
          />
        )}
      </DetailDrawer>
    </>
  );
}
