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
}

export function RevenueFilters({
  selectedRange,
  onRangeChange,
  selectedSegment,
  onSegmentChange,
}: RevenueFiltersProps) {
  return (
    <FilterBar actions={<RefreshButton />}>
      <DateRangeFilter
        value={selectedRange}
        onChange={onRangeChange}
        options={forecastRangeOptions}
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
