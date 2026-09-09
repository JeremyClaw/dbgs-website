export type FluentDeliveryFormat = "in_person" | "remote";

export const FLUENT_INTRO_DURATION_MINUTES = 15;

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
