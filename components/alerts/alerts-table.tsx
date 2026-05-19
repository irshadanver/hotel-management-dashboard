"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Filter } from "lucide-react";
import { ALERT_ROUTES } from "@/lib/drill-down/routes";
import { useLocale } from "@/lib/i18n/locale";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { useAlerts } from "@/lib/api/hooks/use-alerts";
import { DataError, DataLoading } from "@/components/shared/data-loading";

type Severity = "critical" | "warning" | "info";
type Status = "open" | "resolved";
type AlertTab = "all" | "critical" | "warning" | "info";

const departments = [
  "All Departments",
  "Front Office",
  "F&B",
  "Finance",
  "Inventory",
  "Purchasing",
  "Engineering",
  "Sales",
];

const tabs: { id: AlertTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "warning", label: "Warnings" },
  { id: "info", label: "Informational" },
];

const severityConfig = {
  critical: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-500",
    dot: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-500",
    dot: "bg-amber-500",
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-500",
    dot: "bg-blue-500",
  },
};

interface AlertsTableProps {
  initialTab?: AlertTab;
  initialDepartment?: string;
}

export function AlertsTable({
  initialTab = "all",
  initialDepartment = "All Departments",
}: AlertsTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AlertTab>(initialTab);
  const [department, setDepartment] = useState(initialDepartment);
  const { rangeQueryKey } = useGlobalDateFilter();
  const { data: fetchedAlerts, loading, error } = useAlerts();
  const [resolvedIds, setResolvedIds] = useState<Set<number>>(new Set());
  const { tr } = useLocale();

  useEffect(() => {
    setResolvedIds(new Set());
  }, [rangeQueryKey]);

  const alerts = useMemo(() => {
    if (!fetchedAlerts) return [];
    return fetchedAlerts.map((alert) =>
      resolvedIds.has(alert.id)
        ? { ...alert, status: "resolved" as Status }
        : alert
    );
  }, [fetchedAlerts, resolvedIds]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setDepartment(initialDepartment);
  }, [initialDepartment]);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesTab = activeTab === "all" || alert.severity === activeTab;
    const matchesDept =
      department === "All Departments" || alert.department === department;
    return matchesTab && matchesDept;
  });

  const handleResolve = (id: number) => {
    setResolvedIds((prev) => new Set(prev).add(id));
  };

  const updateUrlFilters = (nextTab: AlertTab, nextDepartment: string) => {
    const params = new URLSearchParams();
    if (nextTab !== "all") params.set("severity", nextTab);
    if (nextDepartment !== "All Departments") {
      params.set("department", nextDepartment);
    }

    const query = params.toString();
    router.replace(query ? `/alerts?${query}` : "/alerts", { scroll: false });
  };

  const handleTabChange = (tab: AlertTab) => {
    setActiveTab(tab);
    updateUrlFilters(tab, department);
  };

  const handleDepartmentChange = (nextDepartment: string) => {
    setDepartment(nextDepartment);
    updateUrlFilters(activeTab, nextDepartment);
  };

  const getCounts = () => {
    return {
      all: alerts.filter((a) => a.status === "open").length,
      critical: alerts.filter(
        (a) => a.severity === "critical" && a.status === "open"
      ).length,
      warning: alerts.filter(
        (a) => a.severity === "warning" && a.status === "open"
      ).length,
      info: alerts.filter((a) => a.severity === "info" && a.status === "open")
        .length,
    };
  };

  const counts = getCounts();

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <DataLoading label={tr("Loading alerts...")} />
        </CardContent>
      </Card>
    );
  }

  if (error || !fetchedAlerts) {
    return (
      <Card>
        <CardContent className="py-12">
          <DataError
            message={error?.message ?? tr("Failed to load alerts")}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold">
            {tr("Alerts & Exceptions")}
          </CardTitle>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={department} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {tr(dept)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tr(tab.label)}
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[tab.id]}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">{tr("Alert Type")}</th>
                <th className="pb-3 pr-4 font-medium">{tr("Description")}</th>
                <th className="pb-3 pr-4 font-medium">{tr("Department")}</th>
                <th className="pb-3 pr-4 font-medium">{tr("Severity")}</th>
                <th className="pb-3 pr-4 font-medium">{tr("Timestamp")}</th>
                <th className="pb-3 pr-4 font-medium">{tr("Status")}</th>
                <th className="pb-3 font-medium">{tr("Action")}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredAlerts.map((alert) => {
                const config = severityConfig[alert.severity];
                const drillDownHref = ALERT_ROUTES[alert.type];
                return (
                  <tr
                    key={alert.id}
                    onClick={() => {
                      if (drillDownHref) window.location.href = drillDownHref;
                    }}
                    className={`border-b transition-colors hover:bg-muted/50 ${
                      drillDownHref ? "cursor-pointer" : ""
                    } ${
                      alert.status === "resolved" ? "opacity-60" : ""
                    }`}
                    title={drillDownHref ? tr("Click row to view details") : undefined}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${config.dot}`}
                        />
                        <span className="font-medium">{tr(alert.type)}</span>
                      </div>
                    </td>
                    <td className="max-w-xs truncate py-3 pr-4 text-muted-foreground">
                      {tr(alert.description)}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline" className="font-normal">
                        {tr(alert.department)}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant="outline"
                        className={`${config.bg} ${config.text} ${config.border}`}
                      >
                        {tr(alert.severity)}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {alert.timestamp}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant={
                          alert.status === "resolved" ? "secondary" : "outline"
                        }
                        className={
                          alert.status === "open"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : ""
                        }
                      >
                        {tr(alert.status === "open" ? "Open" : "Resolved")}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {alert.status === "open" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleResolve(alert.id);
                            }}
                            className="h-8 gap-1.5 text-xs"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            {tr("Resolve")}
                          </Button>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            {tr("Done")}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredAlerts.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              {tr("No alerts found matching your filters.")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
