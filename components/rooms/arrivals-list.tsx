"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";

interface Arrival {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  eta: string;
  status: "expected" | "checked-in" | "delayed";
  isVIP: boolean;
}

const arrivals: Arrival[] = [
  {
    id: "1",
    guestName: "Ahmed Al-Rashid",
    roomNumber: "501",
    roomType: "Executive Suite",
    eta: "14:00",
    status: "expected",
    isVIP: true,
  },
  {
    id: "2",
    guestName: "Sarah Johnson",
    roomNumber: "305",
    roomType: "Deluxe",
    eta: "15:30",
    status: "expected",
    isVIP: false,
  },
  {
    id: "3",
    guestName: "Mohammed Khalil",
    roomNumber: "202",
    roomType: "Standard",
    eta: "12:00",
    status: "checked-in",
    isVIP: false,
  },
  {
    id: "4",
    guestName: "Emily Chen",
    roomNumber: "410",
    roomType: "Deluxe",
    eta: "16:00",
    status: "expected",
    isVIP: true,
  },
  {
    id: "5",
    guestName: "Omar Farooq",
    roomNumber: "108",
    roomType: "Standard",
    eta: "11:00",
    status: "delayed",
    isVIP: false,
  },
  {
    id: "6",
    guestName: "Lisa Thompson",
    roomNumber: "303",
    roomType: "Deluxe",
    eta: "17:00",
    status: "expected",
    isVIP: false,
  },
];

const statusStyles = {
  expected: "bg-amber-100 text-amber-700",
  "checked-in": "bg-emerald-100 text-emerald-700",
  delayed: "bg-red-100 text-red-700",
};

export function ArrivalsList() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Arrivals Today
          </CardTitle>
          <Badge variant="secondary" className="font-normal">
            {arrivals.length} guests
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-y-auto">
          <div className="divide-y divide-border">
            {arrivals.map((arrival) => (
              <div
                key={arrival.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {arrival.guestName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {arrival.guestName}
                      </span>
                      {arrival.isVIP && (
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{arrival.roomNumber}</span>
                      <span>·</span>
                      <span>{arrival.roomType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{arrival.eta}</span>
                  </div>
                  <Badge
                    className={`${statusStyles[arrival.status]} border-0 text-xs font-medium`}
                  >
                    {arrival.status === "checked-in"
                      ? "Checked In"
                      : arrival.status === "delayed"
                        ? "Delayed"
                        : "Expected"}
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
