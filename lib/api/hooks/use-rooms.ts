"use client";

import {
  fetchRoomArrivals,
  fetchRoomDepartures,
  fetchRoomStatus,
  fetchRoomsKPIs,
  fetchRoomsOccupancyTrend,
  fetchVIPGuests,
} from "../services/rooms";
import type { RoomFilters } from "../mock/rooms";
import { useApiQuery } from "./use-api-query";

function roomFilterDeps(filters?: RoomFilters) {
  return [filters?.date ?? "today", filters?.roomType ?? "all"];
}

export function useRoomsKPIs(filters?: RoomFilters) {
  return useApiQuery(() => fetchRoomsKPIs(filters), roomFilterDeps(filters));
}

export function useRoomStatus(filters?: RoomFilters) {
  return useApiQuery(() => fetchRoomStatus(filters), roomFilterDeps(filters));
}

export function useRoomArrivals(filters?: RoomFilters) {
  return useApiQuery(() => fetchRoomArrivals(filters), roomFilterDeps(filters));
}

export function useRoomDepartures(filters?: RoomFilters) {
  return useApiQuery(() => fetchRoomDepartures(filters), roomFilterDeps(filters));
}

export function useVIPGuests(filters?: RoomFilters) {
  return useApiQuery(() => fetchVIPGuests(filters), roomFilterDeps(filters));
}

export function useRoomsOccupancyTrend(filters?: RoomFilters) {
  return useApiQuery(
    () => fetchRoomsOccupancyTrend(filters),
    roomFilterDeps(filters)
  );
}
