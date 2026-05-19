"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useOpenChecks } from "@/lib/api/hooks/use-fnb";
import type { FnBFilters } from "@/lib/api/mock/fnb";
import { useLocale } from "@/lib/i18n/locale";

interface OpenChecksPanelProps {
  filters?: FnBFilters;
}

export function OpenChecksPanel({ filters }: OpenChecksPanelProps) {
  const { data: openChecks, loading, error } = useOpenChecks(filters);
  const { tr } = useLocale();
  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading open checks..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !openChecks) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load open checks"} />
        </CardContent>
      </Card>
    );
  }

  const totalOpen = openChecks.reduce((sum, check) => sum + check.amount, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">{tr("Open Checks")}</CardTitle>
          </div>
          <Badge variant="secondary" className="font-semibold">
            {openChecks.length} {tr("Open")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {tr("Total")}: <span className="font-semibold text-foreground">SAR {totalOpen.toLocaleString()}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {openChecks.map((check) => (
          <div
            key={check.checkNumber}
            className={`flex items-center justify-between rounded-lg border p-3 ${
              check.duration > 60 ? "border-amber-200 bg-amber-50/50" : "bg-muted/30"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{check.checkNumber}</span>
                <span className="text-xs text-muted-foreground">{check.table}</span>
                {check.duration > 60 && (
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{check.server}</span>
                <span>•</span>
                <span>{check.openTime}</span>
                <span>•</span>
                <span className={check.duration > 60 ? "text-amber-600 font-medium" : ""}>
                  {check.duration} {tr("min")}
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold tabular-nums">
              SAR {check.amount}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
