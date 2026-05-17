"use client";

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
  return useApiQuery(fetchDashboardKPIs);
}

export function useRevenueTrend() {
  return useApiQuery(fetchRevenueTrend);
}

export function useOccupancyForecast() {
  return useApiQuery(fetchOccupancyForecast);
}

export function useDashboardArrivals() {
  return useApiQuery(fetchDashboardArrivals);
}

export function useDashboardDepartures() {
  return useApiQuery(fetchDashboardDepartures);
}

export function useDashboardExceptions() {
  return useApiQuery(fetchDashboardExceptions);
}
