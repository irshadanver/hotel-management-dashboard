"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useLowDemand } from "@/lib/api/hooks/use-revenue";
import type { RevenueFilters } from "@/lib/api/mock/revenue";

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "critical":
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-700 hover:bg-red-100"
        >
          Critical
        </Badge>
      );
    case "warning":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          Low
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          Watch
        </Badge>
      );
  }
}

interface LowDemandTableProps {
  filters?: RevenueFilters;
}

export function LowDemandTable({ filters }: LowDemandTableProps) {
  const { data: lowDemandDates, loading, error } = useLowDemand(filters);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading low-demand dates..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !lowDemandDates) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load low-demand dates"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base font-semibold">
            Low-Demand Dates
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium">Date</TableHead>
              <TableHead className="text-xs font-medium">Day</TableHead>
              <TableHead className="text-right text-xs font-medium">
                Occupancy
              </TableHead>
              <TableHead className="text-right text-xs font-medium">
                Available
              </TableHead>
              <TableHead className="text-right text-xs font-medium">
                ADR
              </TableHead>
              <TableHead className="text-center text-xs font-medium">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowDemandDates.map((item) => (
              <TableRow
                key={item.date}
                className={
                  item.severity === "critical"
                    ? "bg-red-50/50"
                    : item.severity === "warning"
                      ? "bg-amber-50/50"
                      : ""
                }
              >
                <TableCell className="py-2.5 text-sm font-medium">
                  {item.date}
                </TableCell>
                <TableCell className="py-2.5 text-sm text-muted-foreground">
                  {item.dayOfWeek}
                </TableCell>
                <TableCell
                  className={`py-2.5 text-right text-sm font-medium ${
                    item.occupancy < 50 ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  {item.occupancy}%
                </TableCell>
                <TableCell className="py-2.5 text-right text-sm">
                  {item.roomsAvailable}
                </TableCell>
                <TableCell className="py-2.5 text-right text-sm text-muted-foreground">
                  SAR {item.adr}
                </TableCell>
                <TableCell className="py-2.5 text-center">
                  {getSeverityBadge(item.severity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
