/**
 * HotelOS API layer
 *
 * Mock data is used by default (no backend required). To connect a real API:
 * 1. Set NEXT_PUBLIC_API_BASE_URL in .env.local
 * 2. Set NEXT_PUBLIC_USE_MOCK_DATA=false
 * 3. Implement backend routes listed in lib/api/endpoints.ts
 * 4. Service functions in lib/api/services/* call apiClient when mocks are off
 *
 * Search the codebase for "API_REQUIRED" to find every integration point.
 */

export { API_CONFIG } from "./config";
export { API_ENDPOINTS } from "./endpoints";
export { apiClient, ApiError } from "./client";

export * from "./services/dashboard";
export * from "./services/rooms";
export * from "./services/alerts";

export * from "./hooks/use-api-query";
export * from "./hooks/use-dashboard";
export * from "./hooks/use-rooms";
export * from "./hooks/use-alerts";

export { getActiveAlertCount } from "./mock/alerts";
