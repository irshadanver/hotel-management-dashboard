import type { DateRangeQuery } from "@/lib/date/date-range-query";

/** Where the drill-down was launched from (drives which date filters apply). */
export type DrillDateSource = "dashboard" | "rooms" | "revenue" | "fnb";

export interface DrillDownUrlParams {
  date?: string | null;
  ctx?: DrillDateSource | null;
  preset?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  roomsDate?: string | null;
  roomType?: string | null;
  revRange?: string | null;
  revSegment?: string | null;
  fnbDate?: string | null;
  fnbOutlet?: string | null;
}

/**
 * Merge date-context query params into an existing `/drilldown?...` href
 * (preserves domain, view, and any other params).
 */
export function withDrillDateContext(
  href: string,
  source: DrillDateSource,
  payload: {
    rangeQuery?: DateRangeQuery;
    roomsDate?: string;
    roomType?: string;
    revRange?: string;
    revSegment?: string;
    fnbDate?: string;
    fnbOutlet?: string;
  }
): string {
  const qIndex = href.indexOf("?");
  const path = qIndex >= 0 ? href.slice(0, qIndex) : href;
  const sp = new URLSearchParams(qIndex >= 0 ? href.slice(qIndex + 1) : undefined);
  sp.set("ctx", source);
  if (source === "dashboard" && payload.rangeQuery) {
    sp.set("preset", payload.rangeQuery.preset);
    sp.set("startDate", payload.rangeQuery.startDate);
    sp.set("endDate", payload.rangeQuery.endDate);
  }
  if (source === "rooms") {
    if (payload.roomsDate) sp.set("roomsDate", payload.roomsDate);
    if (payload.roomType) sp.set("roomType", payload.roomType);
    if (payload.roomsDate === "header" && payload.rangeQuery) {
      sp.set("preset", payload.rangeQuery.preset);
      sp.set("startDate", payload.rangeQuery.startDate);
      sp.set("endDate", payload.rangeQuery.endDate);
    }
  }
  if (source === "revenue") {
    if (payload.revRange) sp.set("revRange", payload.revRange);
    if (payload.revSegment) sp.set("revSegment", payload.revSegment);
    if (payload.revRange === "header" && payload.rangeQuery) {
      sp.set("preset", payload.rangeQuery.preset);
      sp.set("startDate", payload.rangeQuery.startDate);
      sp.set("endDate", payload.rangeQuery.endDate);
    }
  }
  if (source === "fnb") {
    if (payload.fnbDate) sp.set("fnbDate", payload.fnbDate);
    if (payload.fnbOutlet) sp.set("fnbOutlet", payload.fnbOutlet);
    if (payload.fnbDate === "header" && payload.rangeQuery) {
      sp.set("preset", payload.rangeQuery.preset);
      sp.set("startDate", payload.rangeQuery.startDate);
      sp.set("endDate", payload.rangeQuery.endDate);
    }
  }
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
}
