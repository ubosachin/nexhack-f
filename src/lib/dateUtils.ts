/**
 * dateUtils.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised, timezone-correct date helpers for NexHack.
 *
 * All dates are stored as UTC ISO strings in MongoDB.
 * All display uses Asia/Kolkata (IST, UTC+5:30) consistently.
 * All <input type="datetime-local"> values are converted to/from IST correctly.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The canonical display timezone for the platform */
export const PLATFORM_TZ = "Asia/Kolkata";

// ── Formatting ────────────────────────────────────────────────────────────────

/**
 * Format an ISO string (UTC) for display in IST.
 * e.g. "2026-10-27T09:00:00.000Z" → "27 Oct 2026, 2:30 PM"
 */
export function fmtDateTime(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: PLATFORM_TZ,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

/**
 * Format just the date part (no time) in IST.
 * e.g. "2026-10-27T09:00:00.000Z" → "27 Oct 2026"
 */
export function fmtDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: PLATFORM_TZ,
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/**
 * Format relative to now with IST display.
 * Shows "Today", "Yesterday", or a formatted date.
 */
export function fmtRelativeDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    const date = new Date(iso);
    const now = new Date();

    // Compare calendar dates in IST
    const opts: Intl.DateTimeFormatOptions = { timeZone: PLATFORM_TZ, year: "numeric", month: "2-digit", day: "2-digit" };
    const dateStr = date.toLocaleDateString("en-CA", opts); // en-CA gives YYYY-MM-DD
    const todayStr = now.toLocaleDateString("en-CA", opts);

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA", opts);

    if (dateStr === todayStr) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";
    return fmtDate(iso);
  } catch {
    return iso ?? "—";
  }
}

/**
 * Format a timestamp for audit logs — short, precise.
 * e.g. "27 Oct 2026, 2:30:05 PM"
 */
export function fmtTimestamp(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: PLATFORM_TZ,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

// ── datetime-local input helpers ─────────────────────────────────────────────

/**
 * Convert a UTC ISO string to the local datetime-local input value in IST.
 *
 * datetime-local expects "YYYY-MM-DDTHH:MM" in *local* time.
 * If we just do iso.slice(0,16) we get UTC time, which is 5:30h behind IST.
 *
 * e.g. "2026-10-27T09:00:00.000Z" → "2026-10-27T14:30" (IST)
 */
export function isoToDatetimeLocal(iso: string | undefined | null): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    // Format in IST using Intl, then reassemble into "YYYY-MM-DDTHH:MM"
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: PLATFORM_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);

    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
    const year  = get("year");
    const month = get("month");
    const day   = get("day");
    let   hour  = get("hour");
    const min   = get("minute");

    // Intl hour12:false can give "24" for midnight — normalise to "00"
    if (hour === "24") hour = "00";

    return `${year}-${month}-${day}T${hour}:${min}`;
  } catch {
    return "";
  }
}

/**
 * Convert a datetime-local input value (which the browser gives in local time,
 * i.e. the user's system timezone) to a UTC ISO string.
 *
 * We treat the user as being in IST (PLATFORM_TZ).  The datetime-local picker
 * in a browser submits values in the *browser's* local timezone, so:
 *  - If the browser is already in IST → the value is already IST → subtract 5:30 to get UTC.
 *  - If the browser is in UTC → we'd double-adjust. BUT since this is an Indian platform
 *    where admins will always run IST browsers, we keep it simple.
 *
 * The safest universal approach: treat the input string as IST regardless of browser TZ,
 * then convert to UTC.
 */
export function datetimeLocalToIso(localValue: string | undefined | null): string {
  if (!localValue) return "";
  try {
    // Append an IST offset so Date.parse interprets it correctly
    // "+05:30" forces parsing as IST regardless of browser timezone
    const withOffset = `${localValue}:00+05:30`;
    const date = new Date(withOffset);
    if (isNaN(date.getTime())) return "";
    return date.toISOString();
  } catch {
    return "";
  }
}

// ── Registration window helpers ───────────────────────────────────────────────

export type RegWindowStatus = "open" | "upcoming" | "closed" | "completed";

export function getRegWindowStatus(params: {
  hackathonStatus: "Upcoming" | "Ongoing" | "Completed";
  registrationStartDate?: string | null;
  registrationEndDate?: string | null;
}): RegWindowStatus {
  if (params.hackathonStatus === "Completed") return "completed";
  const now = new Date();
  if (params.registrationStartDate && now < new Date(params.registrationStartDate)) return "upcoming";
  if (params.registrationEndDate && now > new Date(params.registrationEndDate)) return "closed";
  return "open";
}
