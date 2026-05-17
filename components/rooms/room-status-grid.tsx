"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Room, RoomStatus } from "@/lib/types";
import { useRoomStatus } from "@/lib/api/hooks/use-rooms";
import { DataError, DataLoading } from "@/components/shared/data-loading";

const statusConfig: Record<
  RoomStatus,
  { label: string; bgColor: string; textColor: string; dotColor: string }
> = {
  "vacant-clean": {
    label: "Vacant Clean",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  "vacant-dirty": {
    label: "Vacant Dirty",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    dotColor: "bg-amber-500",
  },
  occupied: {
    label: "Occupied",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
  },
  "out-of-order": {
    label: "Out of Order",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    dotColor: "bg-red-500",
  },
  reserved: {
    label: "Reserved",
    bgColor: "bg-violet-50",
    textColor: "text-violet-700",
    dotColor: "bg-violet-500",
  },
  maintenance: {
    label: "Maintenance",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    dotColor: "bg-orange-500",
  },
};

interface RoomStatusGridProps {
  selectedRoomType: string;
}

export function RoomStatusGrid({ selectedRoomType }: RoomStatusGridProps) {
  const { data: rooms, loading, error } = useRoomStatus();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataLoading />
        </CardContent>
      </Card>
    );
  }
  if (error || !rooms) {
    return (
      <Card className="shadow-sm">
        <CardContent>
          <DataError message={error?.message ?? "Failed to load rooms"} />
        </CardContent>
      </Card>
    );
  }

  const filteredRooms =
    selectedRoomType === "all"
      ? rooms
      : rooms.filter(
          (r) => r.type.toLowerCase() === selectedRoomType.toLowerCase()
        );

  const groupedByFloor = filteredRooms.reduce(
    (acc, room) => {
      if (!acc[room.floor]) acc[room.floor] = [];
      acc[room.floor].push(room);
      return acc;
    },
    {} as Record<number, Room[]>
  );

  const statusCounts = filteredRooms.reduce(
    (acc, room) => {
      acc[room.status] = (acc[room.status] || 0) + 1;
      return acc;
    },
    {} as Record<RoomStatus, number>
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold">
            Room Status Grid
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            {(Object.keys(statusConfig) as RoomStatus[]).map((status) => (
              <div key={status} className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full",
                    statusConfig[status].dotColor
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {statusConfig[status].label} ({statusCounts[status] || 0})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedByFloor)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([floor, floorRooms]) => (
              <div key={floor}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Floor {floor}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
                  {floorRooms.map((room) => {
                    const config = statusConfig[room.status];
                    return (
                      <button
                        key={room.number}
                        className={cn(
                          "group relative flex flex-col items-center justify-center rounded-lg border p-2 transition-all hover:shadow-md",
                          config.bgColor,
                          "border-transparent hover:border-current",
                          config.textColor
                        )}
                        title={`${room.number} - ${room.type}${room.guest ? ` - ${room.guest}` : ""}`}
                      >
                        <span className="text-sm font-semibold">
                          {room.number}
                        </span>
                        <span className="text-[10px] opacity-75">
                          {room.type.slice(0, 3)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
