/**
 * Routes where the global header date range picker is interactive.
 * Drill-down and utility pages are excluded so the range stays fixed for the drill context.
 */
const HEADER_DATE_RANGE_ENABLED = new Set([
  "/",
  "/rooms",
  "/revenue",
  "/fnb",
  "/inventory",
  "/finance",
  "/alerts",
]);

export function isHeaderDateRangeSelectionEnabled(
  pathname: string | null | undefined
): boolean {
  if (!pathname) return false;
  return HEADER_DATE_RANGE_ENABLED.has(pathname);
}
