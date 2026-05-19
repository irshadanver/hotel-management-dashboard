"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoomsKPICards } from "@/components/rooms/rooms-kpi-cards";
import { RoomStatusGrid } from "@/components/rooms/room-status-grid";
import { ArrivalsList } from "@/components/rooms/arrivals-list";
import { DeparturesList } from "@/components/rooms/departures-list";
import { VIPPanel } from "@/components/rooms/vip-panel";
import { RoomsFilters } from "@/components/rooms/rooms-filters";
import { RoomsOccupancyChart } from "@/components/rooms/rooms-occupancy-chart";
import { DataLoading } from "@/components/shared/data-loading";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { useSyncScreenWithHeader } from "@/lib/date/use-sync-screen-with-header";

function RoomsPageContent() {
  const searchParams = useSearchParams();
  const { rangeQuery } = useGlobalDateFilter();
  const statusFilter = searchParams.get("status");
  const highlightRoom = searchParams.get("room");
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedRoomType, setSelectedRoomType] = useState("all");

  useSyncScreenWithHeader(setSelectedDate);

  const roomFilters = useMemo(
    () => ({
      date: selectedDate,
      roomType: selectedRoomType,
      ...(selectedDate === "header" ? { headerRange: rangeQuery } : {}),
    }),
    [selectedDate, selectedRoomType, rangeQuery]
  );

  return (
    <DashboardShell
      activeItem="rooms"
      title="Rooms Dashboard"
      subtitle="Front Office Operations Overview"
    >
      <RoomsFilters
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedRoomType={selectedRoomType}
        onRoomTypeChange={setSelectedRoomType}
      />

      <RoomsKPICards filters={roomFilters} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoomStatusGrid
            filters={roomFilters}
            statusFilter={statusFilter}
            highlightRoom={highlightRoom}
          />
        </div>
        <div className="space-y-6">
          <ArrivalsList filters={roomFilters} />
          <DeparturesList filters={roomFilters} />
          <VIPPanel filters={roomFilters} />
        </div>
      </div>

      <RoomsOccupancyChart filters={roomFilters} />
    </DashboardShell>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<DataLoading label="Loading rooms..." />}>
      <RoomsPageContent />
    </Suspense>
  );
}
