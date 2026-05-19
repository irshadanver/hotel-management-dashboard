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
import { useLocale } from "@/lib/i18n/locale";

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
  const { tr } = useLocale();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Select value={selectedDate} onValueChange={onDateChange}>
            <SelectTrigger className="min-w-[180px] sm:w-[200px]">
              <Calendar className="me-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={tr("Select date")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header">{tr("Use Header Date")}</SelectItem>
              <SelectItem value="today">{tr("Today")}</SelectItem>
              <SelectItem value="tomorrow">{tr("Tomorrow")}</SelectItem>
              <SelectItem value="yesterday">{tr("Yesterday")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedRoomType} onValueChange={onRoomTypeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={tr("Room type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tr("All Room Types")}</SelectItem>
              <SelectItem value="standard">{tr("Standard")}</SelectItem>
              <SelectItem value="deluxe">{tr("Deluxe")}</SelectItem>
              <SelectItem value="suite">{tr("Suite")}</SelectItem>
              <SelectItem value="executive">{tr("Executive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button variant="outline" size="sm" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        {tr("Refresh")}
      </Button>
    </div>
  );
}
