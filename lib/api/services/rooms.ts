import { API_CONFIG } from "../config";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import {
  getFilteredRoomArrivals,
  getFilteredRoomDepartures,
  getFilteredRooms,
  getFilteredRoomsKPIs,
  getFilteredRoomsOccupancyTrend,
  getFilteredVIPGuests,
  type RoomArrival,
  type RoomDeparture,
  type RoomFilters,
  type RoomKPI,
  type VIPGuest,
} from "../mock/rooms";
import type { Room, TimeSeriesDataPoint } from "@/lib/types";

/** API_REQUIRED: GET /api/rooms/kpis */
export async function fetchRoomsKPIs(filters?: RoomFilters): Promise<RoomKPI[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredRoomsKPIs(filters));
  return apiClient<RoomKPI[]>(API_ENDPOINTS.rooms.kpis);
}

/** API_REQUIRED: GET /api/rooms/status */
export async function fetchRoomStatus(filters?: RoomFilters): Promise<Room[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredRooms(filters));
  return apiClient<Room[]>(API_ENDPOINTS.rooms.status);
}

/** API_REQUIRED: GET /api/rooms/arrivals */
export async function fetchRoomArrivals(
  filters?: RoomFilters
): Promise<RoomArrival[]> {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getFilteredRoomArrivals(filters));
  }
  return apiClient<RoomArrival[]>(API_ENDPOINTS.rooms.arrivals);
}

/** API_REQUIRED: GET /api/rooms/departures */
export async function fetchRoomDepartures(
  filters?: RoomFilters
): Promise<RoomDeparture[]> {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getFilteredRoomDepartures(filters));
  }
  return apiClient<RoomDeparture[]>(API_ENDPOINTS.rooms.departures);
}

/** API_REQUIRED: GET /api/rooms/vip */
export async function fetchVIPGuests(filters?: RoomFilters): Promise<VIPGuest[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredVIPGuests(filters));
  return apiClient<VIPGuest[]>(API_ENDPOINTS.rooms.vipGuests);
}

/** API_REQUIRED: GET /api/rooms/occupancy-trend */
export async function fetchRoomsOccupancyTrend(
  filters?: RoomFilters
): Promise<TimeSeriesDataPoint[]> {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getFilteredRoomsOccupancyTrend(filters));
  }
  return apiClient<TimeSeriesDataPoint[]>(API_ENDPOINTS.rooms.occupancyTrend);
}
