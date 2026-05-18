"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { NavItemId } from "@/components/layout/dashboard-shell";
import { DataLoading } from "@/components/shared/data-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getDrillDownDataset } from "@/lib/drill-down/data";

const domainToNav: Record<string, NavItemId> = {
  rooms: "rooms",
  revenue: "revenue",
  fnb: "fnb",
  finance: "finance",
  inventory: "inventory",
};

const domainToHref: Record<string, string> = {
  rooms: "/rooms",
  revenue: "/revenue",
  fnb: "/fnb",
  finance: "/finance",
  inventory: "/inventory",
};

function DrillDownContent() {
  const searchParams = useSearchParams();
  const dataset = getDrillDownDataset(searchParams.get("domain"), searchParams.get("view"), {
    date: searchParams.get("date"),
  });

  if (!dataset) {
    return (
      <DashboardShell
        activeItem="dashboard"
        title="Drill-Down"
        subtitle="The requested drill-down dataset was not found."
      >
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-muted-foreground">
              This link does not point to a known dataset. Go back to the
              dashboard and try another KPI or exception.
            </p>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  const backHref = domainToHref[dataset.domain] ?? "/";
  const backLabel = `Back to ${dataset.domain === "fnb" ? "F&B" : dataset.domain}`;

  return (
    <DashboardShell
      activeItem={domainToNav[dataset.domain] ?? "dashboard"}
      title={dataset.title}
      subtitle={dataset.subtitle}
      headerActions={
        <Button asChild variant="outline" size="sm">
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Dataset: {dataset.domain}</Badge>
        <Badge variant="outline">View: {dataset.view}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Relevant Records</CardTitle>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Source: {dataset.source}</p>
            <p>API_REQUIRED: {dataset.apiRequired}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {dataset.columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(column.align === "right" && "text-right")}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataset.rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={dataset.columns.length}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No records for this drill-down.
                  </TableCell>
                </TableRow>
              ) : (
                dataset.rows.map((row, index) => (
                  <TableRow key={index}>
                    {dataset.columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn(column.align === "right" && "text-right")}
                      >
                        {row[column.key] ?? "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

export default function DrillDownPage() {
  return (
    <Suspense fallback={<DataLoading label="Loading drill-down..." />}>
      <DrillDownContent />
    </Suspense>
  );
}
