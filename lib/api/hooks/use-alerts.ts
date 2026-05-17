"use client";

import { fetchAlerts } from "../services/alerts";
import { useApiQuery } from "./use-api-query";

export function useAlerts() {
  return useApiQuery(fetchAlerts);
}
