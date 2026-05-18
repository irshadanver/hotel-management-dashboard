"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Room } from "@/lib/types";
import { roomDetailHref } from "@/lib/drill-down/routes";
import { ExternalLink } from "lucide-react";

const statusLabels: Record<Room["status"], string> = {
  "vacant-clean": "Vacant Clean",
  "vacant-dirty": "Vacant Dirty",
  occupied: "Occupied",
  reserved: "Reserved",
  maintenance: "Maintenance",
  "out-of-order": "Out of Order",
};

interface RoomDetailPanelProps {
  room: Room;
}

export function RoomDetailPanel({ room }: RoomDetailPanelProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0 text-3xl font-semibold">Room {room.number}</span>
        <Badge variant="outline">{statusLabels[room.status]}</Badge>
      </div>
      <dl className="grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Floor</dt>
          <dd className="font-medium">{room.floor}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Type</dt>
          <dd className="font-medium">{room.type}</dd>
        </div>
        {room.guest && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Guest</dt>
            <dd className="min-w-0 text-right font-medium">{room.guest}</dd>
          </div>
        )}
        {room.notes && (
          <div>
            <dt className="text-muted-foreground">Notes</dt>
            <dd className="mt-1 font-medium">{room.notes}</dd>
          </div>
        )}
      </dl>
      <Separator />
      <p className="text-xs text-muted-foreground">
        API_REQUIRED: GET /api/rooms/{room.number} for folio, housekeeping, and
        maintenance history.
      </p>
      <Button asChild variant="outline" className="w-full">
        <Link href={roomDetailHref(room.number)}>
          Open in Rooms dashboard
          <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
