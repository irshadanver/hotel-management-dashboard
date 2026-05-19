"use client";

import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { fetchAlerts } from "../services/alerts";
import { useApiQuery } from "./use-api-query";

export function useAlerts() {
  const { rangeQuery, rangeQueryKey } = useGlobalDateFilter();
  return useApiQuery(() => fetchAlerts(rangeQuery), [rangeQueryKey]);
}
