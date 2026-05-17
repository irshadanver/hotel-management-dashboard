import type { Room, RoomStatus } from "@/lib/types";
import type { TimeSeriesDataPoint } from "@/lib/types";

export interface RoomKPI {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
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

export const mockRoomsKPIs: RoomKPI[] = [
  {
    title: "Rooms Available",
    value: 42,
    subtitle: "of 180 total",
    color: "oklch(0.65 0.15 145)",
  },
  {
    title: "Rooms Sold",
    value: 138,
    subtitle: "Confirmed",
    color: "oklch(0.55 0.15 250)",
  },
  {
    title: "Occupancy %",
    value: "76.7%",
    subtitle: "+3.2% vs yesterday",
    color: "oklch(0.55 0.12 280)",
  },
  {
    title: "Arrivals Today",
    value: 28,
    subtitle: "5 checked in",
    color: "oklch(0.65 0.12 165)",
  },
  {
    title: "Departures Today",
    value: 24,
    subtitle: "18 checked out",
    color: "oklch(0.65 0.15 50)",
  },
  {
    title: "No-Shows",
    value: 2,
    subtitle: "Last 24h",
    color: "oklch(0.55 0.2 25)",
  },
];

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
  const pattern: RoomStatus[] = [
    "vacant-clean",
    "vacant-dirty",
    "occupied",
    "occupied",
    "occupied",
    "vacant-clean",
    "out-of-order",
  ];
  const rooms: Room[] = [];
  let nameIdx = 0;

  for (let floor = 1; floor <= 5; floor++) {
    for (let room = 1; room <= 12; room++) {
      const number = `${floor}${room.toString().padStart(2, "0")}`;
      const status = pattern[(floor * room) % pattern.length];
      rooms.push({
        number,
        floor,
        type: types[(floor + room) % types.length],
        status,
        guest:
          status === "occupied" ? names[nameIdx++ % names.length] : undefined,
      });
    }
  }
  return rooms;
}

export const mockRooms: Room[] = buildMockRooms();

export const mockRoomArrivals: RoomArrival[] = [
  {
    id: "1",
    guestName: "Ahmed Al-Rashid",
    roomNumber: "501",
    roomType: "Executive Suite",
    eta: "14:00",
    status: "expected",
    isVIP: true,
  },
  {
    id: "2",
    guestName: "Sarah Johnson",
    roomNumber: "305",
    roomType: "Deluxe",
    eta: "15:30",
    status: "expected",
    isVIP: false,
  },
  {
    id: "3",
    guestName: "Mohammed Khalil",
    roomNumber: "202",
    roomType: "Standard",
    eta: "12:00",
    status: "checked-in",
    isVIP: false,
  },
  {
    id: "4",
    guestName: "Emily Chen",
    roomNumber: "410",
    roomType: "Deluxe",
    eta: "16:00",
    status: "expected",
    isVIP: true,
  },
  {
    id: "5",
    guestName: "Omar Farooq",
    roomNumber: "108",
    roomType: "Standard",
    eta: "11:00",
    status: "delayed",
    isVIP: false,
  },
  {
    id: "6",
    guestName: "Lisa Thompson",
    roomNumber: "303",
    roomType: "Deluxe",
    eta: "17:00",
    status: "expected",
    isVIP: false,
  },
];

export const mockRoomDepartures: RoomDeparture[] = [
  {
    id: "1",
    guestName: "John Williams",
    roomNumber: "405",
    roomType: "Deluxe",
    etd: "11:00",
    status: "checked-out",
    balance: 0,
  },
  {
    id: "2",
    guestName: "Fatima Al-Zahrani",
    roomNumber: "312",
    roomType: "Standard",
    etd: "12:00",
    status: "due-out",
    balance: 450,
  },
  {
    id: "3",
    guestName: "Michael Brown",
    roomNumber: "801",
    roomType: "Suite",
    etd: "12:30",
    status: "checked-out",
    balance: 0,
  },
  {
    id: "4",
    guestName: "Aisha Mohammed",
    roomNumber: "215",
    roomType: "Standard",
    etd: "13:00",
    status: "extended",
    balance: 1250,
  },
];

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

export const mockRoomsOccupancyTrend: TimeSeriesDataPoint[] = [
  { date: "Mon", occupancy: 72 },
  { date: "Tue", occupancy: 75 },
  { date: "Wed", occupancy: 78 },
  { date: "Thu", occupancy: 82 },
  { date: "Fri", occupancy: 88 },
  { date: "Sat", occupancy: 92 },
  { date: "Sun", occupancy: 85 },
];
