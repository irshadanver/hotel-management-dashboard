import type { DateRangeQuery } from "@/lib/date/date-range-query";
import { API_CONFIG } from "../config";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import {
  getDashboardArrivalsForRange,
  getDashboardDeparturesForRange,
  getDashboardExceptionsForRange,
  getDashboardKPIsForRange,
  getOccupancyForecastForRange,
  getRevenueTrendForRange,
} from "../mock/dashboard-for-preset";

function withDateRange(path: string, q: DateRangeQuery): string {
  const joiner = path.includes("?") ? "&" : "?";
  const params = new URLSearchParams({
    dateRange: q.preset,
    startDate: q.startDate,
    endDate: q.endDate,
  });
  return `${path}${joiner}${params.toString()}`;
}

/** API_REQUIRED: GET /api/dashboard/kpis */
export async function fetchDashboardKPIs(q: DateRangeQuery) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getDashboardKPIsForRange(q));
  }
  return apiClient(withDateRange(API_ENDPOINTS.dashboard.kpis, q));
}

/** API_REQUIRED: GET /api/dashboard/revenue-trend */
export async function fetchRevenueTrend(q: DateRangeQuery) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getRevenueTrendForRange(q));
  }
  return apiClient(withDateRange(API_ENDPOINTS.dashboard.revenueTrend, q));
}

/** API_REQUIRED: GET /api/dashboard/occupancy-forecast */
export async function fetchOccupancyForecast(q: DateRangeQuery) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getOccupancyForecastForRange(q));
  }
  return apiClient(
    withDateRange(API_ENDPOINTS.dashboard.occupancyForecast, q)
  );
}

/** API_REQUIRED: GET /api/dashboard/arrivals */
export async function fetchDashboardArrivals(q: DateRangeQuery) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getDashboardArrivalsForRange(q));
  }
  return apiClient(withDateRange(API_ENDPOINTS.dashboard.arrivals, q));
}

/** API_REQUIRED: GET /api/dashboard/departures */
export async function fetchDashboardDepartures(q: DateRangeQuery) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getDashboardDeparturesForRange(q));
  }
  return apiClient(withDateRange(API_ENDPOINTS.dashboard.departures, q));
}

/** API_REQUIRED: GET /api/dashboard/exceptions */
export async function fetchDashboardExceptions(q: DateRangeQuery) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getDashboardExceptionsForRange(q));
  }
  return apiClient(withDateRange(API_ENDPOINTS.dashboard.exceptions, q));
}
