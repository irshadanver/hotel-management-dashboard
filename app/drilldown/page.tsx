"use client";

import Link from "next/link";
import { Suspense } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ListChecks,
  TrendingUp,
} from "lucide-react";
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
import { useLocale } from "@/lib/i18n/locale";
import {
  getDrillDownDataset,
  type DrillDownDataset,
} from "@/lib/drill-down/data";
import type { DrillDownUrlParams } from "@/lib/drill-down/query-params";

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

function getPrimaryValue(dataset: DrillDownDataset) {
  if (dataset.primaryMetric) return dataset.primaryMetric;

  const metricValues: Record<string, string> = {
    "rooms:available": "42",
    "rooms:occupied": "138",
    "rooms:sold": "138",
    "rooms:occupancy-forecast": "84.3%",
    "rooms:arrivals": "28",
    "rooms:departures": "24",
    "rooms:no-shows": "2",
    "revenue:occupancy-forecast": "84.3%",
    "fnb:today-sales": "SAR 18,450",
    "fnb:covers": "284",
    "fnb:average-check": "SAR 65",
    "fnb:discounts": "SAR 1,240",
    "fnb:voids": "SAR 320",
    "inventory:stock-value": "SAR 847,250",
    "inventory:below-reorder": "8",
    "inventory:pending-pos": "7",
    "inventory:price-variance": "4",
    "inventory:negative-stock": "5",
    "finance:total-revenue-today": "SAR 127,450",
    "finance:cash-balance": "SAR 892,340",
    "finance:cash-position": "SAR 892,340",
    "finance:accounts-receivable": "SAR 324,780",
    "finance:accounts-payable": "SAR 156,920",
  };
  const mappedValue = metricValues[`${dataset.domain}:${dataset.view}`];
  if (mappedValue) return mappedValue;

  const firstRow = dataset.rows[0];
  if (!firstRow) return "-";

  if ("amount" in firstRow) return String(firstRow.amount);
  if ("value" in firstRow) return String(firstRow.value);
  if ("occupancy" in firstRow) return String(firstRow.occupancy);
  if ("stock" in firstRow) return String(firstRow.stock);
  return String(dataset.rows.length);
}

function getSummaryCards(dataset: DrillDownDataset) {
  const uniqueStatuses = new Set(
    dataset.rows
      .map((row) => row.status)
      .filter((status): status is string | number => status !== undefined)
  );

  return [
    {
      label: "Breakdown Rows",
      value: dataset.rows.length.toString(),
      helper: "Rows shown below",
      icon: ListChecks,
    },
    {
      label: "Primary Value",
      value: getPrimaryValue(dataset),
      helper: "Top visible metric",
      icon: TrendingUp,
    },
    {
      label: "Status Groups",
      value: uniqueStatuses.size ? uniqueStatuses.size.toString() : "1",
      helper: "Distinct statuses",
      icon: BarChart3,
    },
  ];
}

function getInsight(dataset: DrillDownDataset) {
  const domainLabel = dataset.domain === "fnb" ? "F&B" : dataset.domain;

  if (dataset.domain === "inventory") {
    return {
      title: "Operational Impact",
      text: "Inventory drill-downs should focus on stock risk, reorder action, pending approval, and vendor follow-up before showing item rows.",
    };
  }

  if (dataset.domain === "finance") {
    return {
      title: "Financial Impact",
      text: "Finance drill-downs should explain cash exposure, settlement status, open AR/AP items, and ownership before listing accounts.",
    };
  }

  if (dataset.domain === "revenue") {
    return {
      title: "Commercial Impact",
      text: "Revenue drill-downs should connect the metric to rate, occupancy, pickup, discounting, and booking pace trends.",
    };
  }

  if (dataset.domain === "rooms") {
    return {
      title: "Front Office Impact",
      text: "Rooms drill-downs should show availability, guest movement, housekeeping status, and exceptions that affect operations.",
    };
  }

  return {
    title: `${domainLabel.toUpperCase()} Impact`,
    text: "This view summarizes the selected operational slice before exposing record-level details.",
  };
}

function getActions(dataset: DrillDownDataset) {
  if (dataset.domain === "inventory") {
    return ["Create purchase request", "Transfer stock", "Assign inventory owner"];
  }

  if (dataset.domain === "finance") {
    return ["Assign collector", "Send reminder", "Export account detail"];
  }

  if (dataset.domain === "revenue") {
    return ["Review rate strategy", "Inspect segments", "Flag revenue exception"];
  }

  if (dataset.domain === "rooms") {
    return ["Open room profile", "Notify housekeeping", "Assign front-office follow-up"];
  }

  return ["Review details", "Assign owner", "Mark as reviewed"];
}

function getBreakdownRows(dataset: DrillDownDataset) {
  const statusCounts = new Map<string, number>();

  for (const row of dataset.rows) {
    const status = String(row.status ?? row.metric ?? row.type ?? "Other");
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
  }

  return Array.from(statusCounts.entries()).slice(0, 5);
}

function DrillDownContent() {
  const searchParams = useSearchParams();
  const { isRTL, tr } = useLocale();
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const drillParams: DrillDownUrlParams = {
    date: searchParams.get("date"),
    ctx: searchParams.get("ctx") as DrillDownUrlParams["ctx"],
    preset: searchParams.get("preset") ?? undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
    roomsDate: searchParams.get("roomsDate") ?? undefined,
    roomType: searchParams.get("roomType") ?? undefined,
    revRange: searchParams.get("revRange") ?? undefined,
    revSegment: searchParams.get("revSegment") ?? undefined,
  };
  const dataset = getDrillDownDataset(
    searchParams.get("domain"),
    searchParams.get("view"),
    drillParams
  );

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
              {tr("This link does not point to a known dataset. Go back to the dashboard and try another KPI or exception.")}
            </p>
            <Button asChild variant="outline">
              <Link href="/">
                <BackIcon className="me-2 h-4 w-4" />
                {tr("Back to dashboard")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  const backHref = domainToHref[dataset.domain] ?? "/";
  const backLabel = `${tr("Back to")} ${tr(dataset.domain === "fnb" ? "F&B" : dataset.domain)}`;

  return (
    <DashboardShell
      activeItem={domainToNav[dataset.domain] ?? "dashboard"}
      title={dataset.title}
      subtitle={dataset.subtitle}
      headerActions={
        <Button asChild variant="outline" size="sm">
          <Link href={backHref}>
            <BackIcon className="me-2 h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{tr("Dataset")}: {tr(dataset.domain)}</Badge>
        <Badge variant="outline">{tr("View")}: {tr(dataset.view)}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {getSummaryCards(dataset).map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="flex min-h-[112px] items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{tr(card.label)}</p>
                  <p className="break-words text-2xl font-semibold">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{tr(card.helper)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-base">{tr(getInsight(dataset).title)}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {tr(getInsight(dataset).text)}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {getBreakdownRows(dataset).map(([label, count]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-sm"
                >
                  <span className="truncate text-muted-foreground">{tr(label)}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base">{tr("Recommended Actions")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {getActions(dataset).map((action) => (
              <Button
                key={action}
                type="button"
                variant="outline"
                className="w-full justify-start"
              >
                {tr(action)}
              </Button>
            ))}
            <p className="pt-2 text-xs text-muted-foreground">
              {tr("API_REQUIRED: connect these actions to workflow endpoints.")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{tr("Supporting Records")}</CardTitle>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>{tr("Source")}: {tr(dataset.source)}</p>
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
                    {tr(column.header)}
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
                    {tr("No records for this drill-down.")}
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
                        {typeof row[column.key] === "string" ? tr(String(row[column.key])) : row[column.key] ?? "-"}
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
