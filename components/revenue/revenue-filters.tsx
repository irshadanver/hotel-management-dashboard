"use client";

import {
  FilterBar,
  DateRangeFilter,
  SelectFilter,
  RefreshButton,
  segmentOptions,
  type FilterOption,
} from "@/components/shared";

const forecastRangeOptions: FilterOption[] = [
  { value: "header", label: "Use Header Date" },
  { value: "7d", label: "Next 7 Days" },
  { value: "14d", label: "Next 14 Days" },
  { value: "30d", label: "Next 30 Days" },
  { value: "90d", label: "Next 90 Days" },
];

interface RevenueFiltersProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  selectedSegment: string;
  onSegmentChange: (segment: string) => void;
  onRefresh?: () => void;
}

export function RevenueFilters({
  selectedRange,
  onRangeChange,
  selectedSegment,
  onSegmentChange,
  onRefresh,
}: RevenueFiltersProps) {
  return (
    <FilterBar actions={<RefreshButton onClick={onRefresh} />}>
      <DateRangeFilter
        value={selectedRange}
        onChange={onRangeChange}
        options={forecastRangeOptions}
        className="min-w-[200px] sm:min-w-[220px]"
      />
      <SelectFilter
        value={selectedSegment}
        onChange={onSegmentChange}
        options={segmentOptions}
        placeholder="Segment"
      />
    </FilterBar>
  );
}
