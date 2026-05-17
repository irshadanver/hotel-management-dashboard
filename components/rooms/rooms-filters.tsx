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

interface RoomsFiltersProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedRoomType: string;
  onRoomTypeChange: (type: string) => void;
}

export function RoomsFilters({
  selectedDate,
  onDateChange,
  selectedRoomType,
  onRoomTypeChange,
}: RoomsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Select value={selectedDate} onValueChange={onDateChange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedRoomType} onValueChange={onRoomTypeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Room Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="deluxe">Deluxe</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button variant="outline" size="sm" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
}
