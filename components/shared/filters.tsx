"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Individual filter components
export interface FilterOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function SelectFilter({
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon,
  className,
}: SelectFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[160px]", className)}>
        {icon && <span className="mr-2">{icon}</span>}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Date range filter
interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
  options?: FilterOption[];
  className?: string;
}

const defaultDateRangeOptions: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "14d", label: "Last 14 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

export function DateRangeFilter({
  value,
  onChange,
  options = defaultDateRangeOptions,
  className,
}: DateRangeFilterProps) {
  return (
    <SelectFilter
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select range"
      icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      className={cn("w-[180px]", className)}
    />
  );
}

// Refresh button
interface RefreshButtonProps {
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

export function RefreshButton({
  onClick,
  loading = false,
  className,
}: RefreshButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-2", className)}
      onClick={onClick}
      disabled={loading}
    >
      <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
      Refresh
    </Button>
  );
}

// Filter bar wrapper
interface FilterBarProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, actions, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex items-center gap-3">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// Common filter option presets
export const segmentOptions: FilterOption[] = [
  { value: "all", label: "All Segments" },
  { value: "corporate", label: "Corporate" },
  { value: "ota", label: "OTA" },
  { value: "direct", label: "Direct" },
  { value: "group", label: "Group" },
];

export const outletOptions: FilterOption[] = [
  { value: "all", label: "All Outlets" },
  { value: "restaurant", label: "Main Restaurant" },
  { value: "cafe", label: "Lobby Cafe" },
  { value: "room-service", label: "Room Service" },
  { value: "bar", label: "Pool Bar" },
  { value: "banquet", label: "Banquet" },
];

export const departmentOptions: FilterOption[] = [
  { value: "all", label: "All Departments" },
  { value: "front-office", label: "Front Office" },
  { value: "fnb", label: "F&B" },
  { value: "housekeeping", label: "Housekeeping" },
  { value: "finance", label: "Finance" },
  { value: "inventory", label: "Inventory" },
];

export const roomTypeOptions: FilterOption[] = [
  { value: "all", label: "All Types" },
  { value: "standard", label: "Standard" },
  { value: "deluxe", label: "Deluxe" },
  { value: "suite", label: "Suite" },
  { value: "executive", label: "Executive" },
];

export const dateOptions: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "yesterday", label: "Yesterday" },
];
