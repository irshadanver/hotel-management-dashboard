export interface HotelUserSession {
  chainId: string;
  propertyId: string;
  userId: string;
  name: string;
  role: string;
  propertyName: string;
}

const SESSION_KEY = "hotelos.session";

/** Max wall-clock time from login before re-auth (hours). */
function maxSessionMs(): number {
  const h = Number(process.env.NEXT_PUBLIC_SESSION_MAX_HOURS ?? "12");
  return Math.max(0.25, Number.isFinite(h) ? h : 12) * 60 * 60 * 1000;
}

/** Idle time without activity before logout (minutes). */
function idleSessionMs(): number {
  const m = Number(process.env.NEXT_PUBLIC_SESSION_IDLE_MINUTES ?? "30");
  return Math.max(1, Number.isFinite(m) ? m : 30) * 60 * 1000;
}

interface SessionEnvelope extends HotelUserSession {
  issuedAt: number;
  lastActivityAt: number;
}

function isHotelUserSessionShape(d: unknown): d is HotelUserSession {
  if (!d || typeof d !== "object") return false;
  const o = d as Record<string, unknown>;
  return (
    typeof o.chainId === "string" &&
    typeof o.propertyId === "string" &&
    typeof o.userId === "string" &&
    typeof o.name === "string" &&
    typeof o.role === "string" &&
    typeof o.propertyName === "string"
  );
}

function isEnvelope(d: unknown): d is SessionEnvelope {
  if (!isHotelUserSessionShape(d)) return false;
  const o = d as Record<string, unknown>;
  return (
    typeof o.issuedAt === "number" &&
    typeof o.lastActivityAt === "number" &&
    Number.isFinite(o.issuedAt) &&
    Number.isFinite(o.lastActivityAt)
  );
}

function clearStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

function envelopeExpired(env: SessionEnvelope, now: number): boolean {
  if (now - env.issuedAt > maxSessionMs()) return true;
  if (now - env.lastActivityAt > idleSessionMs()) return true;
  return false;
}

function stripEnvelope(env: SessionEnvelope): HotelUserSession {
  return {
    chainId: env.chainId,
    propertyId: env.propertyId,
    userId: env.userId,
    name: env.name,
    role: env.role,
    propertyName: env.propertyName,
  };
}

export function getStoredSession(): HotelUserSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isEnvelope(parsed)) {
      clearStorage();
      return null;
    }
    const now = Date.now();
    if (envelopeExpired(parsed, now)) {
      clearStorage();
      return null;
    }
    return stripEnvelope(parsed);
  } catch {
    clearStorage();
    return null;
  }
}

/**
 * Call on navigation or periodic activity to extend the idle timeout.
 * No-op if there is no valid session.
 */
export function touchSessionActivity(): void {
  if (typeof window === "undefined") return;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isEnvelope(parsed)) {
      clearStorage();
      return;
    }
    const now = Date.now();
    if (envelopeExpired(parsed, now)) {
      clearStorage();
      return;
    }
    const next: SessionEnvelope = {
      ...parsed,
      lastActivityAt: now,
    };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    clearStorage();
  }
}

export function saveSession(input: {
  chainId: string;
  propertyId: string;
  userId: string;
}): HotelUserSession {
  const now = Date.now();
  const session: HotelUserSession = {
    ...input,
    name: input.userId || "Hotel User",
    role: "General Manager",
    propertyName: input.propertyId || "Al Madinah Grand Hotel",
  };

  const envelope: SessionEnvelope = {
    ...session,
    issuedAt: now,
    lastActivityAt: now,
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(envelope));
  return session;
}

export function clearSession() {
  clearStorage();
}
