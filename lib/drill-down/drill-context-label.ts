import type { DrillDownUrlParams } from "./query-params";

/** Human-readable lines for the drill-down context strip (from URL params). */
export function formatDrillContextLines(
  params: DrillDownUrlParams
): string[] {
  const lines: string[] = [];
  if (params.ctx) {
    lines.push(`Source: ${params.ctx}`);
  }
  if (params.preset || params.startDate || params.endDate) {
    const p = params.preset ?? "—";
    const s = params.startDate ?? "";
    const e = params.endDate ?? "";
    lines.push(
      s && e ? `Range: ${p} (${s}–${e})` : `Range preset: ${p}`
    );
  }
  if (params.roomsDate || params.roomType) {
    const rd = params.roomsDate ?? "—";
    const rt = params.roomType ?? "all";
    lines.push(`Rooms: ${rd} · ${rt}`);
  }
  if (params.revRange || params.revSegment) {
    lines.push(
      `Revenue: ${params.revRange ?? "—"} · ${params.revSegment ?? "all"}`
    );
  }
  if (params.fnbDate || params.fnbOutlet) {
    lines.push(
      `F&B: ${params.fnbDate ?? "—"} · ${params.fnbOutlet ?? "all"}`
    );
  }
  if (params.date) {
    lines.push(`Date: ${params.date}`);
  }
  return lines;
}
