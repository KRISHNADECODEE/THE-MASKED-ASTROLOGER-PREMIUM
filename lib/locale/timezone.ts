// Timezone helpers. The astrologer's slots are defined in IST (UTC+05:30);
// these convert them to the visitor's local timezone for display.

export function getUserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
  } catch {
    return "Asia/Kolkata";
  }
}

/** Short label like "GMT-5" / "IST" for a timezone. */
export function timeZoneAbbr(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
  } catch {
    return tz;
  }
}

function parse12h(slot: string): { h: number; m: number } | null {
  const match = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let h = parseInt(match[1], 10) % 12;
  if (/pm/i.test(match[3])) h += 12;
  return { h, m: parseInt(match[2], 10) };
}

/**
 * Convert an IST slot string ("04:00 PM") to the visitor's local time string.
 * Returns the original slot if parsing fails or the user is already in IST.
 */
export function istSlotToLocal(slot: string, tz: string): string {
  const t = parse12h(slot);
  if (!t) return slot;
  const now = new Date();
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(t.h).padStart(2, "0");
  const mm = String(t.m).padStart(2, "0");
  // Unambiguous IST instant (+05:30), then render in the user's timezone.
  const date = new Date(`${y}-${mo}-${d}T${hh}:${mm}:00+05:30`);
  try {
    return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(date);
  } catch {
    return slot;
  }
}

export function isIST(tz: string): boolean {
  return tz === "Asia/Kolkata" || tz === "Asia/Calcutta";
}
