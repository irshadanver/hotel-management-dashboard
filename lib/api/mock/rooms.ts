import { formatPercent, type Room, type RoomStatus } from "@/lib/types";
import type { TimeSeriesDataPoint } from "@/lib/types";

export interface RoomKPI {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

export interface RoomFilters {
  date?: string;
  roomType?: string;
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
  };
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
  const { date, roomType } = normalizeFilters(filters);
  const typeCounters: Record<string, number> = {};

  return mockRooms
    .map((room) => {
      const typeIndex = typeCounters[room.type] ?? 0;
      typeCounters[room.type] = typeIndex + 1;
      const status = statusForRoom(date, room, typeIndex);

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
  const { date, roomType } = normalizeFilters(filters);
  return filterByRoomType(buildRoomArrivals(date), roomType);
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
  const { date, roomType } = normalizeFilters(filters);
  return filterByRoomType(buildRoomDepartures(date), roomType);
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

export const mockRoomsOccupancyTrend: TimeSeriesDataPoint[] = [
  { date: "Mon", occupancy: 72 },
  { date: "Tue", occupancy: 75 },
  { date: "Wed", occupancy: 78 },
  { date: "Thu", occupancy: 82 },
  { date: "Fri", occupancy: 88 },
  { date: "Sat", occupancy: 92 },
  { date: "Sun", occupancy: 85 },
];

export function getFilteredRoomsOccupancyTrend(filters?: RoomFilters) {
  const { date, roomType } = normalizeFilters(filters);
  const typeFactor =
    roomType === "all"
      ? 0
      : { standard: -4, deluxe: 1, suite: 3, executive: 5 }[roomType] ?? 0;
  const dateFactor = { yesterday: -3, today: 0, tomorrow: 2 }[date] ?? 0;

  return mockRoomsOccupancyTrend.map((point) => ({
    ...point,
    occupancy: Math.max(
      0,
      Math.min(100, Number(point.occupancy) + typeFactor + dateFactor)
    ),
  }));
}

export function getFilteredRoomsKPIs(filters?: RoomFilters): RoomKPI[] {
  const { date, roomType } = normalizeFilters(filters);
  const rooms = getFilteredRooms({ date, roomType });
  const arrivals = getFilteredRoomArrivals({ date, roomType });
  const departures = getFilteredRoomDepartures({ date, roomType });
  const occupancyTrend = getFilteredRoomsOccupancyTrend({ date, roomType });
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
  const dateLabel = dateLabels[date] ?? "Selected date";

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
      value: date === "tomorrow" ? 0 : roomType === "all" ? 2 : 1,
      subtitle: dateLabel,
      color: "oklch(0.55 0.2 25)",
    },
  ];
}

export const mockRoomsKPIs: RoomKPI[] = getFilteredRoomsKPIs();
