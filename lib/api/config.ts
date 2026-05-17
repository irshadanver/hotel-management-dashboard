/**
 * API configuration. Set NEXT_PUBLIC_API_BASE_URL when connecting a real backend.
 * While USE_MOCK_DATA is true, all services return local mock data (no network calls).
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false",
} as const;
