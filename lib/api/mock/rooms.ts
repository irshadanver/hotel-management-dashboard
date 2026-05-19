import { formatPercent, type Room, type RoomStatus } from "@/lib/types";
import type { TimeSeriesDataPoint } from "@/lib/types";
import type { DateRangePreset } from "@/lib/date/date-range-preset";
import {
  buildDateRangeQuery,
  parseYYYYMMDD,
  startOfLocalDay,
  type DateRangeQuery,
} from "@/lib/date/date-range-query";
import { mockNumericScale } from "@/lib/date/preset-multipliers";

export interface RoomKPI {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

export interface RoomFilters {
  date?: string;
  roomType?: string;
  /** When `date` is `"header"`, mirrors the executive header date range. */
  headerRange?: DateRangeQuery | null;
}

export interface RoomArrival {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  eta: string;
  status: "expected" | "checked-in" | "delayed";
  isVIP: boolean;
}

export interface RoomDeparture {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  etd: string;
  status: "due-out" | "checked-out" | "extended";
  balance: number;
}

export interface VIPGuest {
  id: string;
  name: string;
  tier: "gold" | "platinum" | "diamond";
  roomNumber: string;
  checkIn: string;
  preferences: string;
}

const dateLabels: Record<string, string> = {
  yesterday: "Yesterday",
  today: "Today",
  tomorrow: "Tomorrow",
};

function normalizeFilters(filters?: RoomFilters) {
  return {
    date: filters?.date ?? "today",
    roomType: filters?.roomType ?? "all",
    headerRange: filters?.headerRange ?? null,
  };
}

const VALID_PRESETS: DateRangePreset[] = [
  "today",
  "yesterday",
  "last7Days",
  "last30Days",
  "custom",
];

function coerceDrillPreset(p?: string | null): DateRangePreset {
  if (p && VALID_PRESETS.includes(p as DateRangePreset)) return p as DateRangePreset;
  return "today";
}

/** Rebuild room filters from drill URL (supports `roomsDate=header` + preset/start/end). */
export function roomFiltersFromDrillUrl(
  roomsDate?: string | null,
  roomType?: string | null,
  preset?: string | null,
  startDate?: string | null,
  endDate?: string | null
): RoomFilters {
  const rt = roomType ?? "all";
  const rd = roomsDate ?? "today";
  if (rd === "header") {
    const pr = coerceDrillPreset(preset);
    const headerRange = buildDateRangeQuery(pr, startDate ?? "", endDate ?? "");
    return { date: "header", roomType: rt, headerRange };
  }
  return { date: rd, roomType: rt };
}

function dayOffsetFromToday(iso: string, now = new Date()): number | null {
  const d = parseYYYYMMDD(iso);
  if (!d) return null;
  const t = startOfLocalDay(now);
  return Math.round(
    (startOfLocalDay(d).getTime() - t.getTime()) / 86_400_000
  );
}

/**
 * Maps the header date range to the discrete "day" mock curve used for room
 * status and arrival/departure templates.
 */
export function innerDateFromHeaderRange(
  q: DateRangeQuery,
  now = new Date()
): "yesterday" | "today" | "tomorrow" {
  if (q.preset === "yesterday") return "yesterday";
  if (q.preset === "today") return "today";
  if (q.preset === "last7Days" || q.preset === "last30Days") return "today";
  if (q.preset === "custom" && q.daySpan === 1 && q.startDate === q.endDate) {
    const off = dayOffsetFromToday(q.startDate, now);
    if (off === -1) return "yesterday";
    if (off === 0) return "today";
    if (off === 1) return "tomorrow";
  }
  return "today";
}

function resolveRoomsEffectiveDate(
  date: string,
  headerRange: DateRangeQuery | null | undefined,
  now = new Date()
): "yesterday" | "today" | "tomorrow" {
  if (date === "header") {
    if (!headerRange) return "today";
    return innerDateFromHeaderRange(headerRange, now);
  }
  if (date === "yesterday" || date === "today" || date === "tomorrow") {
    return date;
  }
  return "today";
}

function scaleRowsByHeaderRange<T>(rows: T[], q: DateRangeQuery): T[] {
  const m = mockNumericScale(q);
  const len = Math.max(3, Math.min(50, Math.round(rows.length * m)));
  return rows.slice(0, len);
}

function roomTypeMatches(roomType: string, selectedRoomType: string) {
  return (
    selectedRoomType === "all" ||
    roomType.toLowerCase().includes(selectedRoomType.toLowerCase())
  );
}

function filterByRoomType<T extends { roomType?: string; type?: string }>(
  rows: T[],
  selectedRoomType: string
) {
  return rows.filter((row) =>
    roomTypeMatches(row.roomType ?? row.type ?? "", selectedRoomType)
  );
}

function buildMockRooms(): Room[] {
  const types = ["Standard", "Deluxe", "Suite", "Executive"];
  const names = [
    "Ahmed Al-Rashid",
    "Sarah Johnson",
    "Mohammed Khalil",
    "Emily Chen",
    "Omar Farooq",
    "Lisa Thompson",
    "Khalid Hassan",
    "Rachel Green",
  ];
  const rooms: Room[] = [];
  let nameIdx = 0;

  for (let floor = 1; floor <= 15; floor++) {
    for (let room = 1; room <= 12; room++) {
      const number = `${floor}${room.toString().padStart(2, "0")}`;
      const type = types[rooms.length % types.length];
      rooms.push({
        number,
        floor,
        type,
        status: "vacant-clean",
        guest: names[nameIdx++ % names.length],
      });
    }
  }
  return rooms;
}

export const mockRooms: Room[] = buildMockRooms();

function statusForRoom(date: string, room: Room, typeIndex: number): RoomStatus {
  if (date === "tomorrow") {
    if (typeIndex < 32) return "occupied";
    if (typeIndex < 36) return "reserved";
    return "vacant-clean";
  }

  if (date === "yesterday") {
    return typeIndex < 33 ? "occupied" : "vacant-clean";
  }

  if (room.type === "Standard" || room.type === "Suite") {
    return typeIndex < 34 ? "occupied" : "vacant-clean";
  }

  return typeIndex < 35 ? "occupied" : "vacant-clean";
}

export function getFilteredRooms(filters?: RoomFilters): Room[] {
  const { date, roomType, headerRange } = normalizeFilters(filters);
  const eff = resolveRoomsEffectiveDate(date, headerRange);
  const typeCounters: Record<string, number> = {};

  return mockRooms
    .map((room) => {
      const typeIndex = typeCounters[room.type] ?? 0;
      typeCounters[room.type] = typeIndex + 1;
      const status = statusForRoom(eff, room, typeIndex);

      return {
        ...room,
        status,
        guest: status === "occupied" ? room.guest : undefined,
      };
    })
    .filter((room) => roomTypeMatches(room.type, roomType));
}

function buildRoomArrivals(date: string): RoomArrival[] {
  const countByDate: Record<string, number> = {
    yesterday: 25,
    today: 28,
    tomorrow: 34,
  };
  const names = [
    "Ahmed Al-Rashid",
    "Sarah Johnson",
    "Mohammed Khalil",
    "Emily Chen",
    "Omar Farooq",
    "Lisa Thompson",
    "Khalid Hassan",
    "Rachel Green",
  ];
  const roomTypes = ["Standard", "Deluxe", "Suite", "Executive"];
  const count = countByDate[date] ?? countByDate.today;

  return Array.from({ length: count }, (_, index) => ({
    id: `${date}-arrival-${index + 1}`,
    guestName: `${names[index % names.length]} ${index + 1}`,
    roomNumber: `${(index % 15) + 1}${((index * 3) % 12 + 1).toString().padStart(2, "0")}`,
    roomType: roomTypes[index % roomTypes.length],
    eta: `${String(10 + (index % 9)).padStart(2, "0")}:00`,
    status:
      date === "yesterday" || index < 5
        ? "checked-in"
        : index % 13 === 0
          ? "delayed"
          : "expected",
    isVIP: index % 9 === 0,
  }));
}

export const mockRoomArrivals: RoomArrival[] = buildRoomArrivals("today");

export function getFilteredRoomArrivals(filters?: RoomFilters): RoomArrival[] {
  const { date, roomType, headerRange } = normalizeFilters(filters);
  const eff = resolveRoomsEffectiveDate(date, headerRange);
  let rows = buildRoomArrivals(eff);
  if (date === "header" && headerRange) {
    rows = scaleRowsByHeaderRange(rows, headerRange);
  }
  return filterByRoomType(rows, roomType);
}

function buildRoomDepartures(date: string): RoomDeparture[] {
  const countByDate: Record<string, number> = {
    yesterday: 27,
    today: 24,
    tomorrow: 20,
  };
  const names = [
    "John Williams",
    "Fatima Al-Zahrani",
    "Michael Brown",
    "Aisha Mohammed",
    "Robert Taylor",
    "Nadia Khan",
  ];
  const roomTypes = ["Standard", "Deluxe", "Suite", "Executive"];
  const count = countByDate[date] ?? countByDate.today;

  return Array.from({ length: count }, (_, index) => ({
    id: `${date}-departure-${index + 1}`,
    guestName: `${names[index % names.length]} ${index + 1}`,
    roomNumber: `${(index % 15) + 1}${((index * 5) % 12 + 1).toString().padStart(2, "0")}`,
    roomType: roomTypes[(index + 1) % roomTypes.length],
    etd: `${String(10 + (index % 6)).padStart(2, "0")}:30`,
    status:
      date === "yesterday" || index < 18
        ? "checked-out"
        : index % 11 === 0
          ? "extended"
          : "due-out",
    balance: index % 7 === 0 ? 450 + index * 25 : 0,
  }));
}

export const mockRoomDepartures: RoomDeparture[] = buildRoomDepartures("today");

export function getFilteredRoomDepartures(filters?: RoomFilters): RoomDeparture[] {
  const { date, roomType, headerRange } = normalizeFilters(filters);
  const eff = resolveRoomsEffectiveDate(date, headerRange);
  let rows = buildRoomDepartures(eff);
  if (date === "header" && headerRange) {
    rows = scaleRowsByHeaderRange(rows, headerRange);
  }
  return filterByRoomType(rows, roomType);
}

export const mockVIPGuests: VIPGuest[] = [
  {
    id: "1",
    name: "Prince Khalid Al-Saud",
    tier: "diamond",
    roomNumber: "1001",
    checkIn: "May 14",
    preferences: "Halal menu, late checkout",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    tier: "platinum",
    roomNumber: "305",
    checkIn: "May 14",
    preferences: "Extra pillows, high floor",
  },
  {
    id: "3",
    name: "Ahmed Al-Rashid",
    tier: "gold",
    roomNumber: "501",
    checkIn: "May 14",
    preferences: "Airport transfer",
  },
];

export function getFilteredVIPGuests(filters?: RoomFilters): VIPGuest[] {
  const { roomType } = normalizeFilters(filters);
  if (roomType === "all") return mockVIPGuests;
  return mockVIPGuests.filter((guest) => {
    const room = mockRooms.find((candidate) => candidate.number === guest.roomNumber);
    return room ? roomTypeMatches(room.type, roomType) : true;
  });
}

/** Next 14 days — forecast vs confirmed pick-up (Rooms occupancy chart). */
export const mockRoomsOccupancyForecast14: TimeSeriesDataPoint[] = [
  { date: "May 19", forecast: 82, confirmed: 76, occupancy: 76 },
  { date: "May 20", forecast: 84, confirmed: 78, occupancy: 78 },
  { date: "May 21", forecast: 86, confirmed: 80, occupancy: 80 },
  { date: "May 22", forecast: 88, confirmed: 81, occupancy: 81 },
  { date: "May 23", forecast: 90, confirmed: 83, occupancy: 83 },
  { date: "May 24", forecast: 89, confirmed: 84, occupancy: 84 },
  { date: "May 25", forecast: 87, confirmed: 82, occupancy: 82 },
  { date: "May 26", forecast: 85, confirmed: 80, occupancy: 80 },
  { date: "May 27", forecast: 83, confirmed: 78, occupancy: 78 },
  { date: "May 28", forecast: 81, confirmed: 76, occupancy: 76 },
  { date: "May 29", forecast: 80, confirmed: 75, occupancy: 75 },
  { date: "May 30", forecast: 82, confirmed: 77, occupancy: 77 },
  { date: "May 31", forecast: 85, confirmed: 80, occupancy: 80 },
  { date: "Jun 1", forecast: 88, confirmed: 83, occupancy: 83 },
];

/** @deprecated Use mockRoomsOccupancyForecast14 */
export const mockRoomsOccupancyTrend = mockRoomsOccupancyForecast14;

export function getFilteredRoomsOccupancyTrend(filters?: RoomFilters) {
  const { date, roomType, headerRange } = normalizeFilters(filters);
  const eff = resolveRoomsEffectiveDate(date, headerRange);
  const typeFactor =
    roomType === "all"
      ? 0
      : { standard: -4, deluxe: 1, suite: 3, executive: 5 }[roomType] ?? 0;
  const dateFactor = { yesterday: -3, today: 0, tomorrow: 2 }[eff] ?? 0;
  const headerAdj =
    date === "header" && headerRange
      ? Math.round((mockNumericScale(headerRange) - 1) * 15)
      : 0;

  const clampPct = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  return mockRoomsOccupancyForecast14.map((point) => {
    const f = clampPct(
      Number(point.forecast) + typeFactor + dateFactor + headerAdj
    );
    const c = clampPct(
      Number(point.confirmed) +
        typeFactor +
        dateFactor +
        headerAdj -
        (eff === "tomorrow" ? -1 : 0)
    );
    return {
      ...point,
      forecast: f,
      confirmed: c,
      occupancy: c,
    };
  });
}

export function getFilteredRoomsKPIs(filters?: RoomFilters): RoomKPI[] {
  const { date, roomType, headerRange } = normalizeFilters(filters);
  const eff = resolveRoomsEffectiveDate(date, headerRange);
  const rooms = getFilteredRooms(filters);
  const arrivals = getFilteredRoomArrivals(filters);
  const departures = getFilteredRoomDepartures(filters);
  const occupancyTrend = getFilteredRoomsOccupancyTrend(filters);
  const availableRooms = rooms.filter((room) => room.status === "vacant-clean").length;
  const soldRooms = rooms.filter(
    (room) => room.status === "occupied" || room.status === "reserved"
  ).length;
  const averageOccupancy =
    occupancyTrend.reduce((sum, point) => sum + Number(point.occupancy), 0) /
    occupancyTrend.length;
  const checkedInArrivals = arrivals.filter(
    (arrival) => arrival.status === "checked-in"
  ).length;
  const checkedOutDepartures = departures.filter(
    (departure) => departure.status === "checked-out"
  ).length;
  const dateLabel =
    date === "header" && headerRange
      ? `${headerRange.startDate} – ${headerRange.endDate}`
      : (dateLabels[eff] ?? "Selected date");

  return [
    {
      title: "Rooms Available",
      value: availableRooms,
      subtitle: `of ${rooms.length} ${roomType === "all" ? "rooms" : roomType}`,
      color: "oklch(0.65 0.15 145)",
    },
    {
      title: "Rooms Sold",
      value: soldRooms,
      subtitle: `${dateLabel} confirmed`,
      color: "oklch(0.55 0.15 250)",
    },
    {
      title: "Occupancy %",
      value: formatPercent(averageOccupancy),
      subtitle: `${dateLabel} trend average`,
      color: "oklch(0.55 0.12 280)",
    },
    {
      title: "Arrivals Today",
      value: arrivals.length,
      subtitle: `${checkedInArrivals} checked in`,
      color: "oklch(0.65 0.12 165)",
    },
    {
      title: "Departures Today",
      value: departures.length,
      subtitle: `${checkedOutDepartures} checked out`,
      color: "oklch(0.65 0.15 50)",
    },
    {
      title: "No-Shows",
      value: eff === "tomorrow" ? 0 : roomType === "all" ? 2 : 1,
      subtitle: dateLabel,
      color: "oklch(0.55 0.2 25)",
    },
  ];
}

export const mockRoomsKPIs: RoomKPI[] = getFilteredRoomsKPIs();
