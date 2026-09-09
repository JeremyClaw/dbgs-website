export type FluentDeliveryFormat = "in_person" | "remote";

export const FLUENT_INTRO_DURATION_MINUTES = 15;
export const PACKAGE_CREDIT_HOURS = 48;

export const PACKAGE_BALANCES = {
  2: 1600,
  3: 2500,
} as const;

export function packageBalanceAfterFirstSession(tier: 2 | 3, hoursSinceFirstSession: number) {
  return hoursSinceFirstSession <= PACKAGE_CREDIT_HOURS ? PACKAGE_BALANCES[tier] : null;
}

export function getDefaultFluentFormat(context: unknown): FluentDeliveryFormat {
  return context === "personal" ? "remote" : "in_person";
}

export function getFluentSlotMinutesForDay(dayOfWeek: number) {
  if (dayOfWeek >= 1 && dayOfWeek <= 5) return [9 * 60, 17 * 60 + 30];
  if (dayOfWeek === 6) return [9 * 60, 10 * 60 + 15];
  return [];
}

export function canConfirmFluentBooking({
  selectedSlot,
  format,
  address,
  contact,
}: {
  selectedSlot: string | null;
  format: FluentDeliveryFormat;
  address: string;
  contact: { name: string; email: string; mobile: string };
}) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return Boolean(
    selectedSlot &&
    contact.name.trim() &&
    emailPattern.test(contact.email.trim()) &&
    contact.mobile.trim() &&
    (format === "remote" || address.trim())
  );
}

export function isFluentDeliveryFormat(value: unknown): value is FluentDeliveryFormat {
  return value === "in_person" || value === "remote";
}

export function getFluentBufferMinutes(format: FluentDeliveryFormat) {
  return format === "in_person" ? 60 : 15;
}

export function getFluentFormatLabel(format: FluentDeliveryFormat) {
  return format === "in_person" ? "In person" : "Remote";
}

export function overlapsWithBuffer(
  slot: { start: Date; end: Date },
  busy: { start: Date; end: Date },
  bufferMinutes: number
) {
  const bufferedStart = new Date(slot.start.getTime() - bufferMinutes * 60 * 1000);
  const bufferedEnd = new Date(slot.end.getTime() + bufferMinutes * 60 * 1000);
  return bufferedStart.getTime() < busy.end.getTime() && busy.start.getTime() < bufferedEnd.getTime();
}
