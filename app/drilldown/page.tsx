"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
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
import { DrillDownChartPanel } from "@/components/drill-down/drill-chart-panel";
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
import { formatDrillContextLines } from "@/lib/drill-down/drill-context-label";
import { inferDrillChart } from "@/lib/drill-down/infer-drill-chart";
import {
  getDrillBreakdownRows,
  getDrillSummaryCards,
  reconciliationForDataset,
} from "@/lib/drill-down/summary-stats";
import { formatSAR } from "@/lib/types";
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

const SUMMARY_ICONS = [ListChecks, TrendingUp, BarChart3] as const;

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

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const s = status.toLowerCase();
  if (s.includes("critical") || s.includes("negative") || s.includes("overdue"))
    return "destructive";
  if (s.includes("posted") || s.includes("reconciled") || s.includes("completed"))
    return "default";
  if (s.includes("pending") || s.includes("open") || s.includes("awaiting"))
    return "secondary";
  return "outline";
}

function isStatusColumn(columnKey: string): boolean {
  return columnKey === "status";
}

function DrillDownContent() {
  const searchParams = useSearchParams();
  const { isRTL, tr } = useLocale();
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const drillParams: DrillDownUrlParams = useMemo(
    () => ({
      date: searchParams.get("date"),
      ctx: searchParams.get("ctx") as DrillDownUrlParams["ctx"],
      preset: searchParams.get("preset") ?? undefined,
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined,
      roomsDate: searchParams.get("roomsDate") ?? undefined,
      roomType: searchParams.get("roomType") ?? undefined,
      revRange: searchParams.get("revRange") ?? undefined,
      revSegment: searchParams.get("revSegment") ?? undefined,
      fnbDate: searchParams.get("fnbDate") ?? undefined,
      fnbOutlet: searchParams.get("fnbOutlet") ?? undefined,
    }),
    [searchParams]
  );

  const dataset = useMemo(() => {
    const d = getDrillDownDataset(
      searchParams.get("domain"),
      searchParams.get("view"),
      drillParams
    );
    if (!d) return null;
    const chart = inferDrillChart(d);
    return chart ? { ...d, chart } : d;
  }, [searchParams, drillParams]);

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
  const contextLines = formatDrillContextLines(drillParams);
  const summaryCards = getDrillSummaryCards(dataset, getPrimaryValue(dataset));
  const breakdownRows = getDrillBreakdownRows(dataset);
  const recon = reconciliationForDataset(dataset);

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

      {contextLines.length > 0 && (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-wrap gap-x-4 gap-y-2 py-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{tr("You are viewing")}</span>
            {contextLines.map((line) => (
              <span key={line} className="rounded-md bg-background/80 px-2 py-0.5 font-mono">
                {line}
              </span>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card, index) => {
          const Icon = SUMMARY_ICONS[index] ?? ListChecks;
          return (
            <Card key={card.label} className={index === 1 && dataset.primaryMetric ? "ring-1 ring-primary/25" : undefined}>
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

      {dataset.chart && (
        <div className="w-full max-w-5xl min-w-0">
          <DrillDownChartPanel spec={dataset.chart} />
        </div>
      )}

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
              {breakdownRows.map(([label, count]) => (
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
          {recon && (
            <div
              className={cn(
                "mt-3 rounded-lg border px-3 py-2 text-sm",
                recon.ok
                  ? "border-emerald-200 bg-emerald-50/60 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-amber-200 bg-amber-50/60 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
              )}
            >
              <span className="font-medium">{tr("Table total")}</span>{" "}
              {formatSAR(recon.tableTotal)}
              <span className="mx-2 text-muted-foreground">·</span>
              <span className="font-medium">{tr("Primary (KPI)")}</span>{" "}
              {formatSAR(recon.primaryParsed)}
              <span className="ms-2 text-xs">
                {recon.ok ? tr("Within tolerance") : tr("Mismatch vs KPI — check filters or rounding")}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="max-h-[min(70vh,720px)] overflow-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card shadow-sm [&_tr]:border-b">
                <TableRow>
                  {dataset.columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={cn(
                        "whitespace-nowrap bg-card",
                        column.align === "right" && "text-right"
                      )}
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
                      <p>{tr("No records for this drill-down.")}</p>
                      {dataset.primaryMetric && (
                        <p className="mt-2 text-xs">
                          {tr("Try changing filters on the source screen, then open this drill-down again.")}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  dataset.rows.map((row, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 1 ? "bg-muted/30" : undefined}
                    >
                      {dataset.columns.map((column) => {
                        const raw = row[column.key];
                        const display =
                          typeof raw === "string" ? tr(String(raw)) : raw ?? "-";
                        const isStatus = isStatusColumn(column.key);
                        return (
                          <TableCell
                            key={column.key}
                            className={cn(
                              column.align === "right" && "text-right tabular-nums",
                              isStatus &&
                                typeof raw === "string" &&
                                "whitespace-nowrap"
                            )}
                          >
                            {isStatus && typeof raw === "string" ? (
                              <Badge variant={statusBadgeVariant(raw)}>
                                {tr(raw)}
                              </Badge>
                            ) : (
                              display
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
