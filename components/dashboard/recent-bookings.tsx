"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Booking {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  amount: string;
  status: "confirmed" | "checked-in" | "pending" | "checked-out";
}

const bookings: Booking[] = [
  {
    id: "BK-2451",
    guest: "Mohammed Al-Rashid",
    room: "Suite 801",
    checkIn: "May 14",
    checkOut: "May 18",
    amount: "SAR 4,850",
    status: "confirmed",
  },
  {
    id: "BK-2450",
    guest: "Sarah Johnson",
    room: "Deluxe 312",
    checkIn: "May 14",
    checkOut: "May 16",
    amount: "SAR 1,240",
    status: "checked-in",
  },
  {
    id: "BK-2449",
    guest: "Abdullah Khan",
    room: "Standard 205",
    checkIn: "May 13",
    checkOut: "May 15",
    amount: "SAR 680",
    status: "checked-in",
  },
  {
    id: "BK-2448",
    guest: "Emma Williams",
    room: "Deluxe 418",
    checkIn: "May 15",
    checkOut: "May 17",
    amount: "SAR 1,120",
    status: "pending",
  },
  {
    id: "BK-2447",
    guest: "Hassan Ibrahim",
    room: "Suite 605",
    checkIn: "May 12",
    checkOut: "May 14",
    amount: "SAR 2,400",
    status: "checked-out",
  },
];

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    variant: "outline" as const,
    className: "border-primary/50 text-primary",
  },
  "checked-in": {
    label: "Checked In",
    variant: "default" as const,
    className: "bg-success text-success-foreground",
  },
  pending: {
    label: "Pending",
    variant: "outline" as const,
    className: "border-warning text-warning-foreground bg-warning/10",
  },
  "checked-out": {
    label: "Checked Out",
    variant: "secondary" as const,
    className: "",
  },
};

export function RecentBookings() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Recent Bookings
          </CardTitle>
          <button className="text-sm text-primary hover:underline">
            View All
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Booking ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const config = statusConfig[booking.status];
              return (
                <TableRow key={booking.id}>
                  <TableCell className="pl-6 font-medium">
                    {booking.id}
                  </TableCell>
                  <TableCell>{booking.guest}</TableCell>
                  <TableCell>{booking.room}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                  <TableCell className="font-medium">{booking.amount}</TableCell>
                  <TableCell className="pr-6">
                    <Badge variant={config.variant} className={config.className}>
                      {config.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
