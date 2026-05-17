"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardDepartures } from "@/lib/api/hooks/use-dashboard";
import { DataError, DataLoading } from "@/components/shared/data-loading";

const statusConfig = {
  "checked-out": { label: "Checked Out", variant: "default" as const },
  pending: { label: "Pending", variant: "secondary" as const },
  overdue: { label: "Overdue", variant: "destructive" as const },
};

export function DeparturesTable() {
  const { data: departures, loading, error } = useDashboardDepartures();

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
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Departures Today
          </CardTitle>
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
                    className="border-b last:border-0 hover:bg-muted/50"
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
  );
}
