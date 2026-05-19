"use client";

import { useEffect, useRef } from "react";
import { useGlobalDateFilter } from "./global-date-filter";

/**
 * While this screen is mounted, any change to the executive header date
 * (including re-selecting the same preset) switches the local range/date
 * control to `headerValue` (default `"header"`) so mocks use `headerRange`.
 */
export function useSyncScreenWithHeader(
  setSelected: (value: string) => void,
  headerValue: string = "header"
) {
  const { rangeQueryKey, rangeQueryRevision } = useGlobalDateFilter();
  const prev = useRef<{ key: string; rev: number } | undefined>(undefined);

  useEffect(() => {
    if (prev.current === undefined) {
      prev.current = { key: rangeQueryKey, rev: rangeQueryRevision };
      return;
    }
    if (
      prev.current.key !== rangeQueryKey ||
      prev.current.rev !== rangeQueryRevision
    ) {
      prev.current = { key: rangeQueryKey, rev: rangeQueryRevision };
      setSelected(headerValue);
    }
  }, [rangeQueryKey, rangeQueryRevision, setSelected, headerValue]);
}
