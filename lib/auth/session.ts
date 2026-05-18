export interface HotelUserSession {
  chainId: string;
  propertyId: string;
  userId: string;
  name: string;
  role: string;
  propertyName: string;
}

const SESSION_KEY = "hotelos.session";

export function getStoredSession(): HotelUserSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as HotelUserSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(input: {
  chainId: string;
  propertyId: string;
  userId: string;
}): HotelUserSession {
  const session: HotelUserSession = {
    ...input,
    name: input.userId || "Hotel User",
    role: "General Manager",
    propertyName: input.propertyId || "Al Madinah Grand Hotel",
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}
