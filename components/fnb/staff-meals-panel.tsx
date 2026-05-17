"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Users } from "lucide-react";

interface MealEntry {
  type: "complimentary" | "staff";
  description: string;
  outlet: string;
  amount: number;
  authorizedBy?: string;
  reason?: string;
}

const mealEntries: MealEntry[] = [
  { type: "complimentary", description: "VIP Guest - Suite 801", outlet: "Main Restaurant", amount: 450, authorizedBy: "GM", reason: "Guest complaint resolution" },
  { type: "complimentary", description: "Wedding Anniversary", outlet: "Main Restaurant", amount: 180, authorizedBy: "F&B Manager", reason: "Dessert & champagne" },
  { type: "staff", description: "Kitchen Staff (12)", outlet: "Staff Cafeteria", amount: 360, reason: "Lunch" },
  { type: "staff", description: "Front Office (8)", outlet: "Staff Cafeteria", amount: 240, reason: "Lunch" },
  { type: "complimentary", description: "Media Influencer", outlet: "Lobby Cafe", amount: 85, authorizedBy: "Marketing", reason: "PR hosting" },
  { type: "staff", description: "Housekeeping (15)", outlet: "Staff Cafeteria", amount: 450, reason: "Lunch" },
];

export function StaffMealsPanel() {
  const complimentary = mealEntries.filter((e) => e.type === "complimentary");
  const staff = mealEntries.filter((e) => e.type === "staff");
  const totalComp = complimentary.reduce((sum, e) => sum + e.amount, 0);
  const totalStaff = staff.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Complimentary & Staff Meals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        {/* Complimentary Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Complimentary
            </span>
            <span className="text-sm font-semibold text-foreground">
              SAR {totalComp.toLocaleString()}
            </span>
          </div>
          {complimentary.map((entry, index) => (
            <div
              key={index}
              className="rounded-lg border bg-muted/30 p-3 space-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">{entry.outlet}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  SAR {entry.amount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {entry.authorizedBy}
                </Badge>
                <span className="text-xs text-muted-foreground">{entry.reason}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Staff Meals Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Staff Meals
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              SAR {totalStaff.toLocaleString()}
            </span>
          </div>
          {staff.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border bg-muted/20 p-3"
            >
              <div>
                <p className="text-sm font-medium">{entry.description}</p>
                <p className="text-xs text-muted-foreground">{entry.outlet} • {entry.reason}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                SAR {entry.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
