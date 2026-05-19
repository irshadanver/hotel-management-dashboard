"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { useTopAccounts } from "@/lib/api/hooks/use-revenue";
import type { RevenueFilters, TopAccountRow } from "@/lib/api/mock/revenue";
import { useLocale } from "@/lib/i18n/locale";

type SortKey = keyof Pick<TopAccountRow, "company" | "nights" | "revenue" | "adr">;
type SortDirection = "asc" | "desc";

interface TopAccountsTableProps {
  filters?: RevenueFilters;
}

function SortHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  align = "center",
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  align?: "left" | "center";
}) {
  const { tr } = useLocale();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => onSort(sortKey)}
      className={`grid h-auto w-full grid-cols-[1fr_12px_30px] items-center gap-1 px-0 py-0 text-xs font-medium ${
        align === "left" ? "text-left" : "mx-auto text-center"
      }`}
    >
      <span className="truncate">{tr(label)}</span>
      <ArrowDownUp className="h-3 w-3" />
      <span className="text-[10px] leading-none">
        {activeKey === sortKey ? tr(direction === "asc" ? "ASC" : "DESC") : ""}
      </span>
    </Button>
  );
}

export function TopAccountsTable({ filters }: TopAccountsTableProps) {
  const { data: accounts, loading, error } = useTopAccounts(filters);
  const { tr } = useLocale();
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedAccounts = useMemo(() => {
    if (!accounts) return [];
    return [...accounts].sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];
      const result =
        typeof first === "string"
          ? first.localeCompare(String(second))
          : Number(first) - Number(second);
      return sortDirection === "asc" ? result : -result;
    });
  }, [accounts, sortDirection, sortKey]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(key === "company" ? "asc" : "desc");
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading label="Loading corporate accounts..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !accounts) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load corporate accounts"} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">
            {tr("Top Corporate Accounts")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[48%]">
                <SortHeader
                  label="Company"
                  sortKey="company"
                  activeKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  align="left"
                />
              </TableHead>
              <TableHead className="w-[16%] text-center text-xs font-medium">
                <SortHeader
                  label="Nights"
                  sortKey="nights"
                  activeKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="w-[20%] text-center text-xs font-medium">
                <SortHeader
                  label="Revenue"
                  sortKey="revenue"
                  activeKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="w-[16%] text-center text-xs font-medium">
                <SortHeader
                  label="ADR"
                  sortKey="adr"
                  activeKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAccounts.map((account, index) => (
              <TableRow key={account.company}>
                <TableCell className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">
                      {account.company}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5 text-center text-sm">
                  {account.nights}
                </TableCell>
                <TableCell className="py-2.5 text-center text-sm font-medium">
                  SAR {account.revenue.toLocaleString()}
                </TableCell>
                <TableCell className="py-2.5 text-center text-sm text-muted-foreground">
                  {account.adr}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
