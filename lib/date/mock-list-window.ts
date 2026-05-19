import type { DateRangeQuery } from "./date-range-query";

function listTakeFraction(daySpan: number): number {
  const d = Math.max(1, Math.min(90, daySpan));
  if (d <= 1) return 1;
  if (d <= 7) {
    return 0.55 + ((0.82 - 0.55) * (d - 1)) / 6;
  }
  if (d < 30) {
    return 0.82 + ((1 - 0.82) * (d - 7)) / 22;
  }
  return 1;
}

/** Limits how many mock list rows appear for the selected date range */
export function mockListTakeCount(total: number, q: DateRangeQuery): number {
  if (total <= 0) return 0;
  const frac = listTakeFraction(q.daySpan);
  return Math.max(1, Math.ceil(total * frac));
}
