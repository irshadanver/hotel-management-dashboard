"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";

export interface GuestDrillDown {
  guestName: string;
  roomType?: string;
  room?: string;
  eta?: string;
  balance?: number;
  status?: string;
}

interface GuestDetailPanelProps {
  guest: GuestDrillDown;
  context: "arrival" | "departure";
}

export function GuestDetailPanel({ guest, context }: GuestDetailPanelProps) {
  const { tr } = useLocale();

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xl font-semibold">{guest.guestName}</span>
        {guest.status && <Badge variant="outline">{tr(guest.status)}</Badge>}
      </div>
      <dl className="grid gap-3 text-sm">
        {guest.room && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{tr("Room")}</dt>
            <dd className="font-medium">{guest.room}</dd>
          </div>
        )}
        {guest.roomType && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{tr("Room type")}</dt>
            <dd className="font-medium">{tr(guest.roomType)}</dd>
          </div>
        )}
        {guest.eta && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {context === "arrival" ? "ETA" : "ETD"}
            </dt>
            <dd className="font-medium">{guest.eta}</dd>
          </div>
        )}
        {guest.balance !== undefined && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{tr("Balance")}</dt>
            <dd className="font-medium">SAR {guest.balance.toLocaleString()}</dd>
          </div>
        )}
      </dl>
      <Separator />
      <p className="text-xs text-muted-foreground">
        API_REQUIRED: GET /api/guests/by-name for reservation, folio, and
        preferences.
      </p>
      {guest.room && (
        <Button asChild variant="outline" className="w-full">
          <Link href={`/rooms?room=${encodeURIComponent(guest.room)}`}>
            {tr("View room")} {guest.room}
            <ExternalLink className="ms-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </>
  );
}
