"use client";

import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import {
  fetchDashboardArrivals,
  fetchDashboardDepartures,
  fetchDashboardExceptions,
  fetchDashboardKPIs,
  fetchOccupancyForecast,
  fetchRevenueTrend,
} from "../services/dashboard";
import { useApiQuery } from "./use-api-query";

export function useDashboardKPIs() {
  const { rangeQuery, rangeQueryKey } = useGlobalDateFilter();
  return useApiQuery(() => fetchDashboardKPIs(rangeQuery), [rangeQueryKey]);
}

export function useRevenueTrend() {
  const { rangeQuery, rangeQueryKey } = useGlobalDateFilter();
  return useApiQuery(() => fetchRevenueTrend(rangeQuery), [rangeQueryKey]);
}

export function useOccupancyForecast() {
  const { rangeQuery, rangeQueryKey } = useGlobalDateFilter();
  return useApiQuery(() => fetchOccupancyForecast(rangeQuery), [rangeQueryKey]);
}

export function useDashboardArrivals() {
  const { rangeQuery, rangeQueryKey } = useGlobalDateFilter();
  return useApiQuery(() => fetchDashboardArrivals(rangeQuery), [rangeQueryKey]);
}

export function useDashboardDepartures() {
  const { rangeQuery, rangeQueryKey } = useGlobalDateFilter();
  return useApiQuery(() => fetchDashboardDepartures(rangeQuery), [rangeQueryKey]);
}

export function useDashboardExceptions() {
  const { rangeQuery, rangeQueryKey } = useGlobalDateFilter();
  return useApiQuery(() => fetchDashboardExceptions(rangeQuery), [rangeQueryKey]);
}
