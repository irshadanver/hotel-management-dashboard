import { apiClient } from "../client";
import { API_CONFIG } from "../config";
import { API_ENDPOINTS } from "../endpoints";
import {
  getFilteredBookingPace,
  getFilteredChannelMix,
  getFilteredLowDemand,
  getFilteredRevenueKPIs,
  getFilteredSegmentRevenue,
  getFilteredTopAccounts,
  type ChannelMixRow,
  type LowDemandRow,
  type RevenueFilters,
  type RevenueKPI,
  type SegmentRevenueRow,
  type TopAccountRow,
} from "../mock/revenue";
import type { TimeSeriesDataPoint } from "@/lib/types";

export const REVENUE_API_NOTE = API_ENDPOINTS.revenue;

/** API_REQUIRED: GET /api/revenue/kpis?range=&segment= */
export async function fetchRevenueKPIs(
  filters?: RevenueFilters
): Promise<RevenueKPI[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredRevenueKPIs(filters));
  return apiClient<RevenueKPI[]>(API_ENDPOINTS.revenue.kpis);
}

/** API_REQUIRED: GET /api/revenue/booking-pace?range=&segment= */
export async function fetchBookingPace(
  filters?: RevenueFilters
): Promise<TimeSeriesDataPoint[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredBookingPace(filters));
  return apiClient<TimeSeriesDataPoint[]>(API_ENDPOINTS.revenue.bookingPace);
}

/** API_REQUIRED: GET /api/revenue/segments?range=&segment= */
export async function fetchSegmentRevenue(
  filters?: RevenueFilters
): Promise<SegmentRevenueRow[]> {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getFilteredSegmentRevenue(filters));
  }
  return apiClient<SegmentRevenueRow[]>(API_ENDPOINTS.revenue.segmentRevenue);
}

/** API_REQUIRED: GET /api/revenue/channels?range=&segment= */
export async function fetchChannelMix(
  filters?: RevenueFilters
): Promise<ChannelMixRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredChannelMix(filters));
  return apiClient<ChannelMixRow[]>(API_ENDPOINTS.revenue.channelMix);
}

/** API_REQUIRED: GET /api/revenue/top-accounts?range=&segment= */
export async function fetchTopAccounts(
  filters?: RevenueFilters
): Promise<TopAccountRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredTopAccounts(filters));
  return apiClient<TopAccountRow[]>(API_ENDPOINTS.revenue.topAccounts);
}

/** API_REQUIRED: GET /api/revenue/low-demand?range=&segment= */
export async function fetchLowDemand(
  filters?: RevenueFilters
): Promise<LowDemandRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredLowDemand(filters));
  return apiClient<LowDemandRow[]>(API_ENDPOINTS.revenue.lowDemand);
}
