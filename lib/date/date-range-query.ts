import type { DateRangePreset } from "./date-range-preset";

/** Resolved range for API + mock layers (inclusive calendar dates, local timezone). */
export interface DateRangeQuery {
  preset: DateRangePreset;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  /** Inclusive calendar day count between start and end */
  daySpan: number;
}

export function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDaysLocal(d: Date, n: number): Date {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + n);
  return x;
}

export function parseYYYYMMDD(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, mo, da] = s.split("-").map(Number);
  const d = new Date(y, mo - 1, da);
  if (
    d.getFullYear() !== y ||
    d.getMonth() !== mo - 1 ||
    d.getDate() !== da
  ) {
    return null;
  }
  return d;
}

export function inclusiveDaySpan(startISO: string, endISO: string): number {
  const a = parseYYYYMMDD(startISO);
  const b = parseYYYYMMDD(endISO);
  if (!a || !b) return 1;
  const ms = startOfLocalDay(b).getTime() - startOfLocalDay(a).getTime();
  return Math.max(1, Math.floor(ms / 86_400_000) + 1);
}

export function defaultCustomRangeStrings(now = new Date()): {
  start: string;
  end: string;
} {
  const today = startOfLocalDay(now);
  return {
    start: toYYYYMMDD(addDaysLocal(today, -6)),
    end: toYYYYMMDD(today),
  };
}

export function buildDateRangeQuery(
  preset: DateRangePreset,
  customStart: string,
  customEnd: string,
  now = new Date()
): DateRangeQuery {
  const fallback = defaultCustomRangeStrings(now);
  const today = startOfLocalDay(now);
  let startDate: string;
  let endDate: string;

  switch (preset) {
    case "today":
      startDate = endDate = toYYYYMMDD(today);
      break;
    case "yesterday": {
      const y = addDaysLocal(today, -1);
      startDate = endDate = toYYYYMMDD(y);
      break;
    }
    case "last7Days":
      endDate = toYYYYMMDD(today);
      startDate = toYYYYMMDD(addDaysLocal(today, -6));
      break;
    case "last30Days":
      endDate = toYYYYMMDD(today);
      startDate = toYYYYMMDD(addDaysLocal(today, -29));
      break;
    case "custom": {
      let s = customStart;
      let e = customEnd;
      if (!parseYYYYMMDD(s) || !parseYYYYMMDD(e)) {
        s = fallback.start;
        e = fallback.end;
      } else {
        const da = parseYYYYMMDD(s)!;
        const db = parseYYYYMMDD(e)!;
        if (da.getTime() > db.getTime()) {
          const tmp = s;
          s = e;
          e = tmp;
        }
      }
      startDate = s;
      endDate = e;
      break;
    }
    default:
      startDate = endDate = toYYYYMMDD(today);
  }

  const daySpan = inclusiveDaySpan(startDate, endDate);
  return { preset, startDate, endDate, daySpan };
}

export function dateRangeQueryKey(q: DateRangeQuery): string {
  return `${q.preset}:${q.startDate}:${q.endDate}:${q.daySpan}`;
}
