"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Users } from "lucide-react";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useMealEntries } from "@/lib/api/hooks/use-fnb";
import type { FnBFilters } from "@/lib/api/mock/fnb";
import { useLocale } from "@/lib/i18n/locale";

interface StaffMealsPanelProps {
  filters?: FnBFilters;
}

export function StaffMealsPanel({ filters }: StaffMealsPanelProps) {
  const { data: mealEntries, loading, error } = useMealEntries(filters);
  const { tr } = useLocale();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading meal entries..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !mealEntries) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load meal entries"} />
        </CardContent>
      </Card>
    );
  }

  const complimentary = mealEntries.filter((e) => e.type === "complimentary");
  const staff = mealEntries.filter((e) => e.type === "staff");
  const totalComp = complimentary.reduce((sum, e) => sum + e.amount, 0);
  const totalStaff = staff.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">{tr("Complimentary & Staff Meals")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        {/* Complimentary Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {tr("Complimentary")}
            </span>
            <span className="text-sm font-semibold text-foreground">
              SAR {totalComp.toLocaleString()}
            </span>
          </div>
          {complimentary.map((entry, index) => (
            <div
              key={index}
              className="rounded-lg border bg-muted/30 p-3 space-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{tr(entry.description)}</p>
                  <p className="text-xs text-muted-foreground">{tr(entry.outlet)}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  SAR {entry.amount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {entry.authorizedBy}
                </Badge>
                <span className="text-xs text-muted-foreground">{tr(entry.reason)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Staff Meals Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {tr("Staff Meals")}
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              SAR {totalStaff.toLocaleString()}
            </span>
          </div>
          {staff.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border bg-muted/20 p-3"
            >
              <div>
                <p className="text-sm font-medium">{tr(entry.description)}</p>
                <p className="text-xs text-muted-foreground">{tr(entry.outlet)} • {tr(entry.reason)}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                SAR {entry.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
