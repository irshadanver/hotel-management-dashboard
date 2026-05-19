"use client";

import type { FnBFilters } from "../mock/fnb";
import {
  fetchFnBKPIs,
  fetchMealEntries,
  fetchMealPeriods,
  fetchOpenChecks,
  fetchOutletSales,
  fetchSlowItems,
  fetchTopItems,
} from "../services/fnb";
import { dateRangeQueryKey } from "@/lib/date/date-range-query";
import { useApiQuery } from "./use-api-query";

function fnbFilterDeps(filters?: FnBFilters) {
  const headerKey =
    filters?.date === "header" && filters?.headerRange
      ? dateRangeQueryKey(filters.headerRange)
      : "";
  return [filters?.date ?? "today", filters?.outlet ?? "all", headerKey];
}

export function useFnBKPIs(filters?: FnBFilters) {
  return useApiQuery(() => fetchFnBKPIs(filters), fnbFilterDeps(filters));
}

export function useOutletSales(filters?: FnBFilters) {
  return useApiQuery(() => fetchOutletSales(filters), fnbFilterDeps(filters));
}

export function useMealPeriods(filters?: FnBFilters) {
  return useApiQuery(() => fetchMealPeriods(filters), fnbFilterDeps(filters));
}

export function useTopItems(filters?: FnBFilters) {
  return useApiQuery(() => fetchTopItems(filters), fnbFilterDeps(filters));
}

export function useSlowItems(filters?: FnBFilters) {
  return useApiQuery(() => fetchSlowItems(filters), fnbFilterDeps(filters));
}

export function useOpenChecks(filters?: FnBFilters) {
  return useApiQuery(() => fetchOpenChecks(filters), fnbFilterDeps(filters));
}

export function useMealEntries(filters?: FnBFilters) {
  return useApiQuery(() => fetchMealEntries(filters), fnbFilterDeps(filters));
}
