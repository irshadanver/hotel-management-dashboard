"use client";

import type { RevenueFilters } from "../mock/revenue";
import {
  fetchBookingPace,
  fetchChannelMix,
  fetchLowDemand,
  fetchRevenueKPIs,
  fetchSegmentRevenue,
  fetchTopAccounts,
} from "../services/revenue";
import { useApiQuery } from "./use-api-query";

function revenueFilterDeps(filters?: RevenueFilters) {
  return [filters?.range ?? "30d", filters?.segment ?? "all"];
}

export function useRevenueKPIs(filters?: RevenueFilters) {
  return useApiQuery(() => fetchRevenueKPIs(filters), revenueFilterDeps(filters));
}

export function useBookingPace(filters?: RevenueFilters) {
  return useApiQuery(() => fetchBookingPace(filters), revenueFilterDeps(filters));
}

export function useSegmentRevenue(filters?: RevenueFilters) {
  return useApiQuery(() => fetchSegmentRevenue(filters), revenueFilterDeps(filters));
}

export function useChannelMix(filters?: RevenueFilters) {
  return useApiQuery(() => fetchChannelMix(filters), revenueFilterDeps(filters));
}

export function useTopAccounts(filters?: RevenueFilters) {
  return useApiQuery(() => fetchTopAccounts(filters), revenueFilterDeps(filters));
}

export function useLowDemand(filters?: RevenueFilters) {
  return useApiQuery(() => fetchLowDemand(filters), revenueFilterDeps(filters));
}
