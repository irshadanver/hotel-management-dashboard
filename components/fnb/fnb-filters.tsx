"use client";

import {
  FilterBar,
  DateRangeFilter,
  SelectFilter,
  RefreshButton,
  outletOptions,
  type FilterOption,
} from "@/components/shared";

const fnbDateOptions: FilterOption[] = [
  { value: "header", label: "Use Header Date" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
  { value: "mtd", label: "Month to Date" },
];

interface FnBFiltersProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedOutlet: string;
  onOutletChange: (outlet: string) => void;
}

export function FnBFilters({
  selectedDate,
  onDateChange,
  selectedOutlet,
  onOutletChange,
}: FnBFiltersProps) {
  return (
    <FilterBar actions={<RefreshButton />}>
      <DateRangeFilter
        value={selectedDate}
        onChange={onDateChange}
        options={fnbDateOptions}
        className="min-w-[200px] sm:min-w-[220px]"
      />
      <SelectFilter
        value={selectedOutlet}
        onChange={onOutletChange}
        options={outletOptions}
        placeholder="Select outlet"
        className="w-[180px]"
      />
    </FilterBar>
  );
}
