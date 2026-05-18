"use client";

import { useState } from "react";
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

type Severity = "critical" | "warning" | "info";
type Status = "open" | "resolved";
type AlertTab = "all" | "critical" | "warning" | "info";

interface Alert {
  id: number;
  type: string;
  description: string;
  department: string;
  severity: Severity;
  timestamp: string;
  status: Status;
}

const alertsData: Alert[] = [
  {
    id: 1,
    type: "High Discount",
    description: "35% discount applied on Room 405 - Guest: Ahmed Al-Rashid",
    department: "Front Office",
    severity: "critical",
    timestamp: "2024-01-15 14:32",
    status: "open",
  },
  {
    id: 2,
    type: "Pending Balance",
    description: "Guest checkout with SAR 2,450 pending - Room 312",
    department: "Front Office",
    severity: "critical",
    timestamp: "2024-01-15 14:15",
    status: "open",
  },
  {
    id: 3,
    type: "Negative Stock",
    description: "Chicken Breast stock at -5 units in Main Kitchen",
    department: "Inventory",
    severity: "critical",
    timestamp: "2024-01-15 13:45",
    status: "open",
  },
  {
    id: 4,
    type: "PO Pending Approval",
    description: "PO-2024-0156 for SAR 12,500 awaiting Finance approval",
    department: "Purchasing",
    severity: "warning",
    timestamp: "2024-01-15 12:30",
    status: "open",
  },
  {
    id: 5,
    type: "Overdue Receivable",
    description: "Global Industries - SAR 125,000 overdue by 45 days",
    department: "Finance",
    severity: "critical",
    timestamp: "2024-01-15 11:00",
    status: "open",
  },
  {
    id: 6,
    type: "Room Maintenance",
    description: "Room 508 AC unit requires repair - Guest complaint",
    department: "Engineering",
    severity: "warning",
    timestamp: "2024-01-15 10:45",
    status: "open",
  },
  {
    id: 7,
    type: "Open Check",
    description: "Check #4521 open for 2+ hours at Lobby Cafe",
    department: "F&B",
    severity: "warning",
    timestamp: "2024-01-15 10:30",
    status: "open",
  },
  {
    id: 8,
    type: "Price Variance",
    description: "Supplier price increased 15% on Salmon - Above threshold",
    department: "Purchasing",
    severity: "warning",
    timestamp: "2024-01-15 09:15",
    status: "open",
  },
  {
    id: 9,
    type: "VIP Arrival",
    description: "Platinum member arriving at 3:00 PM - Room upgrade ready",
    department: "Front Office",
    severity: "info",
    timestamp: "2024-01-15 09:00",
    status: "open",
  },
  {
    id: 10,
    type: "Daily Report",
    description: "Night audit completed successfully",
    department: "Finance",
    severity: "info",
    timestamp: "2024-01-15 06:00",
    status: "resolved",
  },
  {
    id: 11,
    type: "Inventory Count",
    description: "Monthly stock count scheduled for tomorrow",
    department: "Inventory",
    severity: "info",
    timestamp: "2024-01-15 08:00",
    status: "open",
  },
  {
    id: 12,
    type: "High Discount",
    description: "28% discount on banquet booking - Manager approved",
    department: "Sales",
    severity: "warning",
    timestamp: "2024-01-14 16:00",
    status: "resolved",
  },
];

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
  const [activeTab, setActiveTab] = useState<AlertTab>(initialTab);
  const [department, setDepartment] = useState(initialDepartment);
  const [alerts, setAlerts] = useState(alertsData);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesTab = activeTab === "all" || alert.severity === activeTab;
    const matchesDept =
      department === "All Departments" || alert.department === department;
    return matchesTab && matchesDept;
  });

  const handleResolve = (id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: "resolved" as Status } : alert
      )
    );
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

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold">
            Alerts & Exceptions
          </CardTitle>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
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
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
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
                <th className="pb-3 pr-4 font-medium">Alert Type</th>
                <th className="pb-3 pr-4 font-medium">Description</th>
                <th className="pb-3 pr-4 font-medium">Department</th>
                <th className="pb-3 pr-4 font-medium">Severity</th>
                <th className="pb-3 pr-4 font-medium">Timestamp</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
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
                    title={drillDownHref ? "Click row to view details" : undefined}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${config.dot}`}
                        />
                        <span className="font-medium">{alert.type}</span>
                      </div>
                    </td>
                    <td className="max-w-xs truncate py-3 pr-4 text-muted-foreground">
                      {alert.description}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline" className="font-normal">
                        {alert.department}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant="outline"
                        className={`${config.bg} ${config.text} ${config.border}`}
                      >
                        {alert.severity}
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
                        {alert.status === "open" ? "Open" : "Resolved"}
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
                            Resolve
                          </Button>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Done
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
              No alerts found matching your filters.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
