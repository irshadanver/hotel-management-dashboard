"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roomStats = [
  { status: "Occupied", count: 157, color: "bg-chart-1" },
  { status: "Available", count: 35, color: "bg-success" },
  { status: "Reserved", count: 12, color: "bg-warning" },
  { status: "Maintenance", count: 4, color: "bg-muted-foreground" },
  { status: "Out of Order", count: 2, color: "bg-destructive" },
];

const totalRooms = roomStats.reduce((acc, stat) => acc + stat.count, 0);

export function RoomStatus() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Room Status</CardTitle>
          <span className="text-sm text-muted-foreground">
            {totalRooms} Total
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="flex h-3 overflow-hidden rounded-full">
          {roomStats.map((stat) => (
            <div
              key={stat.status}
              className={`${stat.color} transition-all`}
              style={{ width: `${(stat.count / totalRooms) * 100}%` }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {roomStats.map((stat) => (
            <div key={stat.status} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${stat.color}`} />
              <span className="flex-1 text-sm text-muted-foreground">
                {stat.status}
              </span>
              <span className="text-sm font-medium">{stat.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
