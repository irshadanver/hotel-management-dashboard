"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Departure {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkoutTime: string;
  status: "pending" | "checked-out" | "late";
  balance: number;
}

const departures: Departure[] = [
  {
    id: "1",
    guestName: "Khalid Hassan",
    roomNumber: "402",
    roomType: "Suite",
    checkoutTime: "12:00",
    status: "checked-out",
    balance: 0,
  },
  {
    id: "2",
    guestName: "Rachel Green",
    roomNumber: "215",
    roomType: "Standard",
    checkoutTime: "11:00",
    status: "pending",
    balance: 450,
  },
  {
    id: "3",
    guestName: "James Wilson",
    roomNumber: "308",
    roomType: "Deluxe",
    checkoutTime: "12:00",
    status: "checked-out",
    balance: 0,
  },
  {
    id: "4",
    guestName: "Fatima Noor",
    roomNumber: "504",
    roomType: "Executive",
    checkoutTime: "14:00",
    status: "late",
    balance: 1250,
  },
  {
    id: "5",
    guestName: "Michael Brown",
    roomNumber: "112",
    roomType: "Standard",
    checkoutTime: "11:00",
    status: "checked-out",
    balance: 0,
  },
  {
    id: "6",
    guestName: "Aisha Khan",
    roomNumber: "301",
    roomType: "Deluxe",
    checkoutTime: "12:00",
    status: "pending",
    balance: 0,
  },
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  "checked-out": "bg-emerald-100 text-emerald-700",
  late: "bg-red-100 text-red-700",
};

export function DeparturesList() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Departures Today
          </CardTitle>
          <Badge variant="secondary" className="font-normal">
            {departures.length} guests
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-y-auto">
          <div className="divide-y divide-border">
            {departures.map((departure) => (
              <div
                key={departure.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {departure.guestName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      {departure.guestName}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{departure.roomNumber}</span>
                      <span>·</span>
                      <span>{departure.roomType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {departure.balance > 0 && (
                    <span className="text-xs font-medium text-destructive">
                      SAR {departure.balance.toLocaleString()}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{departure.checkoutTime}</span>
                  </div>
                  <Badge
                    className={`${statusStyles[departure.status]} border-0 text-xs font-medium`}
                  >
                    {departure.status === "checked-out"
                      ? "Checked Out"
                      : departure.status === "late"
                        ? "Late"
                        : "Pending"}
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
