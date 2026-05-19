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
import { dateRangeQueryKey } from "@/lib/date/date-range-query";
import { useApiQuery } from "./use-api-query";

function roomFilterDeps(filters?: RoomFilters) {
  const headerKey =
    filters?.date === "header" && filters?.headerRange
      ? dateRangeQueryKey(filters.headerRange)
      : "";
  return [filters?.date ?? "today", filters?.roomType ?? "all", headerKey];
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
