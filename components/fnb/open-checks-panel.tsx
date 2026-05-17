"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";

interface OpenCheck {
  checkNumber: string;
  table: string;
  server: string;
  amount: number;
  openTime: string;
  duration: number;
}

const openChecks: OpenCheck[] = [
  { checkNumber: "CHK-4521", table: "Table 12", server: "Ahmed K.", amount: 485, openTime: "12:30 PM", duration: 95 },
  { checkNumber: "CHK-4518", table: "Pool Bar 3", server: "Sara M.", amount: 220, openTime: "1:15 PM", duration: 50 },
  { checkNumber: "CHK-4523", table: "Table 8", server: "Mohammed R.", amount: 165, openTime: "1:45 PM", duration: 20 },
  { checkNumber: "CHK-4520", table: "Room 412", server: "Fatima A.", amount: 340, openTime: "12:45 PM", duration: 80 },
  { checkNumber: "CHK-4525", table: "Table 5", server: "Ahmed K.", amount: 95, openTime: "2:00 PM", duration: 5 },
];

export function OpenChecksPanel() {
  const totalOpen = openChecks.reduce((sum, check) => sum + check.amount, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Open Checks</CardTitle>
          </div>
          <Badge variant="secondary" className="font-semibold">
            {openChecks.length} Open
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">SAR {totalOpen.toLocaleString()}</span>
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
                  {check.duration} min
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
