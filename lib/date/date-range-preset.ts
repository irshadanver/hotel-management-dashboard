/**
 * Header date filter — drives mock scaling and (later) API query params.
 */
export type DateRangePreset =
  | "today"
  | "yesterday"
  | "last7Days"
  | "last30Days"
  | "custom";

export const DEFAULT_DATE_RANGE_PRESET: DateRangePreset = "today";
