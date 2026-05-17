"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardArrivals } from "@/lib/api/hooks/use-dashboard";
import { DataError, DataLoading } from "@/components/shared/data-loading";

const statusConfig = {
  confirmed: { label: "Confirmed", variant: "default" as const },
  pending: { label: "Pending", variant: "secondary" as const },
  vip: { label: "VIP", variant: "outline" as const },
};

export function ArrivalsTable() {
  const { data: arrivals, loading, error } = useDashboardArrivals();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading />
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
            Arrivals Today
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {arrivals.length} Guests
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
                  Room Type
                </th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                  ETA
                </th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {arrivals.map((arrival) => {
                const config = statusConfig[arrival.status];
                return (
                  <tr
                    key={arrival.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3 text-sm font-medium">
                      {arrival.guestName}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {arrival.roomType}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {arrival.eta}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={config.variant}
                        className={
                          arrival.status === "vip"
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : ""
                        }
                      >
                        {config.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
