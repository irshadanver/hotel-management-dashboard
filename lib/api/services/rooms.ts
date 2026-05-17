import { API_CONFIG } from "../config";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import {
  mockRoomArrivals,
  mockRoomDepartures,
  mockRooms,
  mockRoomsKPIs,
  mockRoomsOccupancyTrend,
  mockVIPGuests,
} from "../mock/rooms";

/** API_REQUIRED: GET /api/rooms/kpis */
export async function fetchRoomsKPIs() {
  if (API_CONFIG.useMockData) return Promise.resolve(mockRoomsKPIs);
  return apiClient(API_ENDPOINTS.rooms.kpis);
}

/** API_REQUIRED: GET /api/rooms/status */
export async function fetchRoomStatus() {
  if (API_CONFIG.useMockData) return Promise.resolve(mockRooms);
  return apiClient(API_ENDPOINTS.rooms.status);
}

/** API_REQUIRED: GET /api/rooms/arrivals */
export async function fetchRoomArrivals() {
  if (API_CONFIG.useMockData) return Promise.resolve(mockRoomArrivals);
  return apiClient(API_ENDPOINTS.rooms.arrivals);
}

/** API_REQUIRED: GET /api/rooms/departures */
export async function fetchRoomDepartures() {
  if (API_CONFIG.useMockData) return Promise.resolve(mockRoomDepartures);
  return apiClient(API_ENDPOINTS.rooms.departures);
}

/** API_REQUIRED: GET /api/rooms/vip */
export async function fetchVIPGuests() {
  if (API_CONFIG.useMockData) return Promise.resolve(mockVIPGuests);
  return apiClient(API_ENDPOINTS.rooms.vipGuests);
}

/** API_REQUIRED: GET /api/rooms/occupancy-trend */
export async function fetchRoomsOccupancyTrend() {
  if (API_CONFIG.useMockData) return Promise.resolve(mockRoomsOccupancyTrend);
  return apiClient(API_ENDPOINTS.rooms.occupancyTrend);
}
