"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileWarning, DollarSign } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { mockNumericScale } from "@/lib/date/preset-multipliers";

const BASE = [
  {
    id: 1,
    type: "unposted",
    title: "Unposted Transactions",
    count: 12,
    description: "Night audit pending",
    severity: "warning" as const,
  },
  {
    id: 2,
    type: "unposted",
    title: "Unposted F&B Charges",
    count: 8,
    description: "From Room Service",
    severity: "warning" as const,
  },
  {
    id: 3,
    type: "balance",
    title: "High Outstanding Balance",
    company: "Global Industries",
    amount: 125000,
    daysOverdue: 45,
    severity: "critical" as const,
  },
  {
    id: 4,
    type: "balance",
    title: "High Outstanding Balance",
    company: "Tech Solutions Ltd",
    amount: 89500,
    daysOverdue: 32,
    severity: "critical" as const,
  },
  {
    id: 5,
    type: "balance",
    title: "Credit Limit Exceeded",
    company: "Acme Corporation",
    amount: 45000,
    limit: 40000,
    severity: "warning" as const,
  },
];

export function FinanceAlertsPanel() {
  const { tr } = useLocale();
  const { rangeQuery } = useGlobalDateFilter();
  const m = mockNumericScale(rangeQuery);

  const alerts = useMemo(
    () =>
      BASE.map((row) => {
        if (row.type === "unposted") {
          return {
            ...row,
            count: Math.max(1, Math.round(row.count * (0.88 + 0.12 * m))),
          };
        }
        if ("limit" in row && row.limit != null) {
          return {
            ...row,
            amount: Math.round(row.amount * m),
            limit: Math.round(row.limit * m),
          };
        }
        return {
          ...row,
          amount: Math.round(row.amount * m),
          daysOverdue: Math.max(
            1,
            Math.round(row.daysOverdue * (0.96 + 0.04 * m))
          ),
        };
      }),
    [m]
  );

  const unpostedAlerts = alerts.filter((a) => a.type === "unposted");
  const balanceAlerts = alerts.filter((a) => a.type === "balance");

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          {tr("Finance Alerts")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileWarning className="h-4 w-4" />
            {tr("Unposted Transactions")}
          </h4>
          <div className="space-y-2">
            {unpostedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{tr(alert.title)}</p>
                  <p className="text-xs text-muted-foreground">
                    {tr(alert.description)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-500 bg-amber-100 text-amber-700"
                >
                  {alert.count} {tr("items")}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            {tr("High Outstanding Balances")}
          </h4>
          <div className="space-y-2">
            {balanceAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  alert.severity === "critical"
                    ? "border-red-200 bg-red-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{alert.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {"daysOverdue" in alert && alert.daysOverdue != null
                      ? `${alert.daysOverdue} ${tr("days overdue")}`
                      : `${tr("Limit")}: SAR ${(alert as { limit?: number }).limit?.toLocaleString()}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">
                    SAR {(alert as { amount?: number }).amount?.toLocaleString()}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      alert.severity === "critical"
                        ? "border-red-500 bg-red-100 text-red-700"
                        : "border-amber-500 bg-amber-100 text-amber-700"
                    }
                  >
                    {tr(alert.severity)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
