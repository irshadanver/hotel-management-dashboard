"use client";

import {
  fetchRoomArrivals,
  fetchRoomDepartures,
  fetchRoomStatus,
  fetchRoomsKPIs,
  fetchRoomsOccupancyTrend,
  fetchVIPGuests,
} from "../services/rooms";
import { useApiQuery } from "./use-api-query";

export function useRoomsKPIs() {
  return useApiQuery(fetchRoomsKPIs);
}

export function useRoomStatus() {
  return useApiQuery(fetchRoomStatus);
}

export function useRoomArrivals() {
  return useApiQuery(fetchRoomArrivals);
}

export function useRoomDepartures() {
  return useApiQuery(fetchRoomDepartures);
}

export function useVIPGuests() {
  return useApiQuery(fetchVIPGuests);
}

export function useRoomsOccupancyTrend() {
  return useApiQuery(fetchRoomsOccupancyTrend);
}
