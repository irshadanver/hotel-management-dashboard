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
import { Building2 } from "lucide-react";

const accounts = [
  {
    company: "Saudi Aramco",
    nights: 245,
    revenue: 142500,
    adr: 582,
  },
  {
    company: "SABIC Corporation",
    nights: 198,
    revenue: 108900,
    adr: 550,
  },
  {
    company: "Saudi Telecom",
    nights: 156,
    revenue: 85800,
    adr: 550,
  },
  {
    company: "National Water Co",
    nights: 134,
    revenue: 67000,
    adr: 500,
  },
  {
    company: "Riyadh Bank",
    nights: 112,
    revenue: 56000,
    adr: 500,
  },
  {
    company: "Al Rajhi Capital",
    nights: 98,
    revenue: 49000,
    adr: 500,
  },
  {
    company: "ACWA Power",
    nights: 87,
    revenue: 43500,
    adr: 500,
  },
  {
    company: "Maaden Mining",
    nights: 76,
    revenue: 38000,
    adr: 500,
  },
];

export function TopAccountsTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">
            Top Corporate Accounts
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium">Company</TableHead>
              <TableHead className="text-right text-xs font-medium">
                Nights
              </TableHead>
              <TableHead className="text-right text-xs font-medium">
                Revenue
              </TableHead>
              <TableHead className="text-right text-xs font-medium">
                ADR
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account, index) => (
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
                <TableCell className="py-2.5 text-right text-sm">
                  {account.nights}
                </TableCell>
                <TableCell className="py-2.5 text-right text-sm font-medium">
                  SAR {account.revenue.toLocaleString()}
                </TableCell>
                <TableCell className="py-2.5 text-right text-sm text-muted-foreground">
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
