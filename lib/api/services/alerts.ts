import { API_CONFIG } from "../config";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import { mockAlerts } from "../mock/alerts";

/** API_REQUIRED: GET /api/alerts */
export async function fetchAlerts() {
  if (API_CONFIG.useMockData) return Promise.resolve(mockAlerts);
  return apiClient(API_ENDPOINTS.alerts.list);
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
