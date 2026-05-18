"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Room, RoomStatus } from "@/lib/types";
import { useRoomStatus } from "@/lib/api/hooks/use-rooms";
import { DataError, DataLoading } from "@/components/shared/data-loading";
import { DetailDrawer } from "@/components/detail/detail-drawer";
import { RoomDetailPanel } from "@/components/detail/room-detail-panel";

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
  statusFilter?: string | null;
  highlightRoom?: string | null;
}

export function RoomStatusGrid({
  selectedRoomType,
  statusFilter,
  highlightRoom,
}: RoomStatusGridProps) {
  const router = useRouter();
  const { data: rooms, loading, error } = useRoomStatus();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!highlightRoom || !rooms) return;
    const match = rooms.find((r) => r.number === highlightRoom);
    if (match) {
      setSelectedRoom(match);
      setDrawerOpen(true);
    }
  }, [highlightRoom, rooms]);

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

  let filteredRooms =
    selectedRoomType === "all"
      ? rooms
      : rooms.filter(
          (r) => r.type.toLowerCase() === selectedRoomType.toLowerCase()
        );

  if (statusFilter) {
    filteredRooms = filteredRooms.filter((r) => r.status === statusFilter);
  }

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

  const openRoom = (room: Room) => {
    setSelectedRoom(room);
    setDrawerOpen(true);
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Room Status Grid
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Click a room for details · click legend to filter
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(statusConfig) as RoomStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    router.push(
                      statusFilter === status
                        ? "/rooms"
                        : `/rooms?status=${status}`
                    )
                  }
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-2 py-1 transition-colors hover:bg-muted",
                    statusFilter === status && "border-primary bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      statusConfig[status].dotColor
                    )}
                  />
                  <span className="text-xs text-muted-foreground">
                    {statusConfig[status].label} ({statusCounts[status] || 0})
                  </span>
                </button>
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
                          type="button"
                          onClick={() => openRoom(room)}
                          className={cn(
                            "group relative flex flex-col items-center justify-center rounded-lg border p-2 transition-all hover:shadow-md cursor-pointer",
                            config.bgColor,
                            "border-transparent hover:border-current",
                            config.textColor,
                            highlightRoom === room.number &&
                              "ring-2 ring-primary ring-offset-1"
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

      <DetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={selectedRoom ? `Room ${selectedRoom.number}` : "Room details"}
        description="Drill-down detail view"
      >
        {selectedRoom && <RoomDetailPanel room={selectedRoom} />}
      </DetailDrawer>
    </>
  );
}
