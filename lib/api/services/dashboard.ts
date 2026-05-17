import { API_CONFIG } from "../config";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import {
  mockDashboardArrivals,
  mockDashboardDepartures,
  mockDashboardExceptions,
  mockDashboardKPIs,
  mockOccupancyForecast,
  mockRevenueTrend,
} from "../mock/dashboard";

/** API_REQUIRED: GET /api/dashboard/kpis */
export async function fetchDashboardKPIs() {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(mockDashboardKPIs);
  }
  return apiClient(API_ENDPOINTS.dashboard.kpis);
}

/** API_REQUIRED: GET /api/dashboard/revenue-trend */
export async function fetchRevenueTrend() {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(mockRevenueTrend);
  }
  return apiClient(API_ENDPOINTS.dashboard.revenueTrend);
}

/** API_REQUIRED: GET /api/dashboard/occupancy-forecast */
export async function fetchOccupancyForecast() {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(mockOccupancyForecast);
  }
  return apiClient(API_ENDPOINTS.dashboard.occupancyForecast);
}

/** API_REQUIRED: GET /api/dashboard/arrivals */
export async function fetchDashboardArrivals() {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(mockDashboardArrivals);
  }
  return apiClient(API_ENDPOINTS.dashboard.arrivals);
}

/** API_REQUIRED: GET /api/dashboard/departures */
export async function fetchDashboardDepartures() {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(mockDashboardDepartures);
  }
  return apiClient(API_ENDPOINTS.dashboard.departures);
}

/** API_REQUIRED: GET /api/dashboard/exceptions */
export async function fetchDashboardExceptions() {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(mockDashboardExceptions);
  }
  return apiClient(API_ENDPOINTS.dashboard.exceptions);
}
