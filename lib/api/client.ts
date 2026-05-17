import { API_CONFIG } from "./config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API_REQUIRED: Use this client for all real HTTP calls once the backend is available.
 */
export async function apiClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  if (!API_CONFIG.baseUrl) {
    throw new Error(
      `API_REQUIRED: Set NEXT_PUBLIC_API_BASE_URL before calling ${path}`
    );
  }

  const response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
      body
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
