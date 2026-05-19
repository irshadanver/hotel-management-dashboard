"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DATE_RANGE_PRESET,
  type DateRangePreset,
} from "./date-range-preset";
import {
  buildDateRangeQuery,
  dateRangeQueryKey,
  defaultCustomRangeStrings,
  parseYYYYMMDD,
  type DateRangeQuery,
} from "./date-range-query";
import { useLocale } from "@/lib/i18n/locale";

interface GlobalDateFilterContextValue {
  preset: DateRangePreset;
  setPreset: (preset: DateRangePreset) => void;
  /** Custom range (YYYY-MM-DD); used when preset === "custom" */
  customStartDate: string;
  customEndDate: string;
  setCustomStartDate: (iso: string) => void;
  setCustomEndDate: (iso: string) => void;
  /** Validates, swaps if needed, sets preset to "custom", updates stored custom dates */
  applyCustomDateRange: (startISO: string, endISO: string) => void;
  rangeQuery: DateRangeQuery;
  /** Stable key for effect deps when range changes */
  rangeQueryKey: string;
  /**
   * Increments whenever the user commits a header date choice from the header
   * UI (preset or custom Apply), including re-selecting the same preset/range.
   */
  rangeQueryRevision: number;
  /** Short label for the header trigger (locale-aware) */
  triggerLabel: string;
}

const GlobalDateFilterContext =
  createContext<GlobalDateFilterContextValue | null>(null);

function formatMediumDate(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function formatRangeLabel(
  start: Date,
  end: Date,
  locale: string,
  rtl: boolean
): string {
  const a = formatMediumDate(start, locale);
  const b = formatMediumDate(end, locale);
  const sep = rtl ? " — " : " – ";
  return `${a}${sep}${b}`;
}

export function GlobalDateFilterProvider({ children }: { children: ReactNode }) {
  const def = useMemo(() => defaultCustomRangeStrings(), []);
  const [preset, setPresetState] = useState<DateRangePreset>(
    DEFAULT_DATE_RANGE_PRESET
  );
  const [customStartDate, setCustomStartDateState] = useState(def.start);
  const [customEndDate, setCustomEndDateState] = useState(def.end);
  const [rangeQueryRevision, setRangeQueryRevision] = useState(0);
  const { locale, isRTL, t } = useLocale();

  const setPreset = useCallback((next: DateRangePreset) => {
    setPresetState(next);
    setRangeQueryRevision((r) => r + 1);
  }, []);

  const setCustomStartDate = useCallback((iso: string) => {
    setCustomStartDateState(iso);
  }, []);

  const setCustomEndDate = useCallback((iso: string) => {
    setCustomEndDateState(iso);
  }, []);

  const applyCustomDateRange = useCallback((startISO: string, endISO: string) => {
    setCustomStartDateState(startISO);
    setCustomEndDateState(endISO);
    setPresetState("custom");
    setRangeQueryRevision((r) => r + 1);
  }, []);

  const rangeQuery = useMemo(
    () => buildDateRangeQuery(preset, customStartDate, customEndDate),
    [preset, customStartDate, customEndDate]
  );

  const rangeQueryKey = useMemo(
    () => dateRangeQueryKey(rangeQuery),
    [rangeQuery]
  );

  const triggerLabel = useMemo(() => {
    const loc = locale === "ar" ? "ar-SA" : "en-US";
    const now = new Date();
    const dayMs = 86_400_000;

    if (preset === "custom") {
      const q = buildDateRangeQuery("custom", customStartDate, customEndDate, now);
      const a = parseYYYYMMDD(q.startDate);
      const b = parseYYYYMMDD(q.endDate);
      if (a && b) return formatRangeLabel(a, b, loc, isRTL);
    }

    switch (preset) {
      case "today":
        return formatMediumDate(now, loc);
      case "yesterday": {
        const y = new Date(now.getTime() - dayMs);
        return formatMediumDate(y, loc);
      }
      case "last7Days": {
        const start = new Date(now.getTime() - 6 * dayMs);
        return formatRangeLabel(start, now, loc, isRTL);
      }
      case "last30Days": {
        const start = new Date(now.getTime() - 29 * dayMs);
        return formatRangeLabel(start, now, loc, isRTL);
      }
      default:
        return formatMediumDate(now, loc);
    }
  }, [preset, customStartDate, customEndDate, locale, isRTL]);

  const value = useMemo(
    () => ({
      preset,
      setPreset,
      customStartDate,
      customEndDate,
      setCustomStartDate,
      setCustomEndDate,
      applyCustomDateRange,
      rangeQuery,
      rangeQueryKey,
      rangeQueryRevision,
      triggerLabel,
    }),
    [
      preset,
      setPreset,
      customStartDate,
      customEndDate,
      setCustomStartDate,
      setCustomEndDate,
      applyCustomDateRange,
      rangeQuery,
      rangeQueryKey,
      rangeQueryRevision,
      triggerLabel,
    ]
  );

  return (
    <GlobalDateFilterContext.Provider value={value}>
      {children}
    </GlobalDateFilterContext.Provider>
  );
}

export function useGlobalDateFilter(): GlobalDateFilterContextValue {
  const ctx = useContext(GlobalDateFilterContext);
  if (!ctx) {
    throw new Error(
      "useGlobalDateFilter must be used within GlobalDateFilterProvider"
    );
  }
  return ctx;
}
