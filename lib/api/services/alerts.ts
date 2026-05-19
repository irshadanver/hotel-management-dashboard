import type { DateRangeQuery } from "@/lib/date/date-range-query";
import { API_CONFIG } from "../config";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import { getAlertsForRange } from "../mock/alerts";

function withDateRange(path: string, q: DateRangeQuery): string {
  const joiner = path.includes("?") ? "&" : "?";
  const params = new URLSearchParams({
    dateRange: q.preset,
    startDate: q.startDate,
    endDate: q.endDate,
  });
  return `${path}${joiner}${params.toString()}`;
}

/** API_REQUIRED: GET /api/alerts */
export async function fetchAlerts(q: DateRangeQuery) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve(getAlertsForRange(q));
  }
  return apiClient(withDateRange(API_ENDPOINTS.alerts.list, q));
}

/** API_REQUIRED: POST /api/alerts/:id/acknowledge */
export async function acknowledgeAlert(id: number) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve({ id, status: "acknowledged" as const });
  }
  return apiClient(API_ENDPOINTS.alerts.acknowledge(String(id)), {
    method: "POST",
  });
}

/** API_REQUIRED: POST /api/alerts/:id/resolve */
export async function resolveAlert(id: number) {
  if (API_CONFIG.useMockData) {
    return Promise.resolve({ id, status: "resolved" as const });
  }
  return apiClient(API_ENDPOINTS.alerts.resolve(String(id)), {
    method: "POST",
  });
}
