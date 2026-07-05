import { google } from "googleapis";
import { getOAuth2Client } from "./auth";

// Slot rules — editable without touching any UI code.
const TIMEZONE = "Africa/Johannesburg"; // SAST, fixed UTC+2, no DST
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;
const SLOT_DURATION_MINUTES = 30;
const BUFFER_MINUTES = 15;
const SLOT_STEP_MINUTES = SLOT_DURATION_MINUTES + BUFFER_MINUTES; // 45
const DEFAULT_DAYS_AHEAD = 14;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// SAST has a fixed +02:00 offset year round, so we can build ISO strings
// directly instead of pulling in a timezone library.
function sastDateTime(year: number, month: number, day: number, hour: number, minute: number) {
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+02:00`;
}

function nowInSAST() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") === 24 ? 0 : get("hour"),
    minute: get("minute"),
  };
}

function addDays(year: number, month: number, day: number, days: number) {
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + days);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function isWeekday(year: number, month: number, day: number) {
  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return dow >= 1 && dow <= 5;
}

type Slot = { start: Date; end: Date };

function generateCandidateSlots(daysAhead: number): Slot[] {
  const now = nowInSAST();
  const slots: Slot[] = [];

  for (let offset = 0; offset <= daysAhead; offset++) {
    const { year, month, day } = addDays(now.year, now.month, now.day, offset);
    if (!isWeekday(year, month, day)) continue;

    for (let minutes = WORK_START_HOUR * 60; minutes + SLOT_DURATION_MINUTES <= WORK_END_HOUR * 60; minutes += SLOT_STEP_MINUTES) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const start = new Date(sastDateTime(year, month, day, hour, minute));
      const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);

      // Skip anything already in the past today.
      if (offset === 0) {
        const nowDate = new Date(sastDateTime(now.year, now.month, now.day, now.hour, now.minute));
        if (start.getTime() <= nowDate.getTime()) continue;
      }

      slots.push({ start, end });
    }
  }

  return slots;
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart.getTime() < bEnd.getTime() && bStart.getTime() < aEnd.getTime();
}

async function getBusyBlocks(timeMin: Date, timeMax: Date) {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: "primary" }],
    },
  });

  const busy = res.data.calendars?.primary?.busy ?? [];
  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({ start: new Date(b.start as string), end: new Date(b.end as string) }));
}

export async function getAvailableSlots(daysAhead: number = DEFAULT_DAYS_AHEAD) {
  const candidates = generateCandidateSlots(daysAhead);
  if (candidates.length === 0) return [];

  const timeMin = candidates[0].start;
  const timeMax = candidates[candidates.length - 1].end;
  const busy = await getBusyBlocks(timeMin, timeMax);

  return candidates
    .filter((slot) => !busy.some((b) => overlaps(slot.start, slot.end, b.start, b.end)))
    .map((slot) => slot.start.toISOString());
}

export async function isSlotStillFree(startISO: string) {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);
  const busy = await getBusyBlocks(start, end);
  return !busy.some((b) => overlaps(start, end, b.start, b.end));
}

export async function createBookingEvent({
  slot,
  name,
  email,
  company,
}: {
  slot: string;
  name: string;
  email: string;
  company?: string;
}) {
  const free = await isSlotStillFree(slot);
  if (!free) {
    return { success: false as const, reason: "slot_taken" as const };
  }

  const start = new Date(slot);
  const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);

  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.insert({
    calendarId: "primary",
    sendUpdates: "all",
    requestBody: {
      summary: `DB Growth Solutions call: ${name}${company ? ` (${company})` : ""}`,
      description: `Fit assessment call booked via the website.\n\nName: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}`,
      start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
      end: { dateTime: end.toISOString(), timeZone: TIMEZONE },
      attendees: [{ email, displayName: name }],
    },
  });

  return { success: true as const, event: res.data };
}
