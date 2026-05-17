"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoomsKPICards } from "@/components/rooms/rooms-kpi-cards";
import { RoomStatusGrid } from "@/components/rooms/room-status-grid";
import { ArrivalsList } from "@/components/rooms/arrivals-list";
import { DeparturesList } from "@/components/rooms/departures-list";
import { VIPPanel } from "@/components/rooms/vip-panel";
import { RoomsFilters } from "@/components/rooms/rooms-filters";
import { RoomsOccupancyChart } from "@/components/rooms/rooms-occupancy-chart";

export default function RoomsPage() {
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedRoomType, setSelectedRoomType] = useState("all");

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

      <RoomsKPICards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoomStatusGrid selectedRoomType={selectedRoomType} />
        </div>
        <div className="space-y-6">
          <ArrivalsList />
          <DeparturesList />
          <VIPPanel />
        </div>
      </div>

      <RoomsOccupancyChart />
    </DashboardShell>
  );
}
