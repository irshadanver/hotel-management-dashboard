import { apiClient } from "../client";
import { API_CONFIG } from "../config";
import { API_ENDPOINTS } from "../endpoints";
import {
  getFilteredFnBKPIs,
  getFilteredMealEntries,
  getFilteredMealPeriods,
  getFilteredOpenChecks,
  getFilteredOutletSales,
  getFilteredSlowItems,
  getFilteredTopItems,
  type FnBFilters,
  type FnBKPI,
  type FnBItemRow,
  type MealEntryRow,
  type MealPeriodRow,
  type OpenCheckRow,
  type OutletSalesRow,
  type SlowItemRow,
} from "../mock/fnb";

export const FNB_API_NOTE = API_ENDPOINTS.fnb;

/** API_REQUIRED: GET /api/fnb/kpis?date=&outlet= */
export async function fetchFnBKPIs(filters?: FnBFilters): Promise<FnBKPI[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredFnBKPIs(filters));
  return apiClient<FnBKPI[]>(API_ENDPOINTS.fnb.kpis);
}

/** API_REQUIRED: GET /api/fnb/outlet-sales?date=&outlet= */
export async function fetchOutletSales(
  filters?: FnBFilters
): Promise<OutletSalesRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredOutletSales(filters));
  return apiClient<OutletSalesRow[]>(API_ENDPOINTS.fnb.outletSales);
}

/** API_REQUIRED: GET /api/fnb/meal-periods?date=&outlet= */
export async function fetchMealPeriods(
  filters?: FnBFilters
): Promise<MealPeriodRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredMealPeriods(filters));
  return apiClient<MealPeriodRow[]>(API_ENDPOINTS.fnb.mealPeriods);
}

/** API_REQUIRED: GET /api/fnb/top-items?date=&outlet= */
export async function fetchTopItems(filters?: FnBFilters): Promise<FnBItemRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredTopItems(filters));
  return apiClient<FnBItemRow[]>(API_ENDPOINTS.fnb.topItems);
}

/** API_REQUIRED: GET /api/fnb/slow-items?date=&outlet= */
export async function fetchSlowItems(filters?: FnBFilters): Promise<SlowItemRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredSlowItems(filters));
  return apiClient<SlowItemRow[]>(API_ENDPOINTS.fnb.slowItems);
}

/** API_REQUIRED: GET /api/fnb/open-checks?date=&outlet= */
export async function fetchOpenChecks(
  filters?: FnBFilters
): Promise<OpenCheckRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredOpenChecks(filters));
  return apiClient<OpenCheckRow[]>(API_ENDPOINTS.fnb.openChecks);
}

/** API_REQUIRED: GET /api/fnb/staff-meals?date=&outlet= */
export async function fetchMealEntries(
  filters?: FnBFilters
): Promise<MealEntryRow[]> {
  if (API_CONFIG.useMockData) return Promise.resolve(getFilteredMealEntries(filters));
  return apiClient<MealEntryRow[]>(API_ENDPOINTS.fnb.staffMeals);
}
