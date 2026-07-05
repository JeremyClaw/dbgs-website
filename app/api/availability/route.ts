import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google/calendar";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const duration = Number(url.searchParams.get("duration") ?? 30);
    const slots = await getAvailableSlots(undefined, duration === 15 ? 15 : 30);
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("[availability] failed to load calendar free/busy", err);
    // Degrade to an empty list rather than breaking the client — BookingReveal
    // already shows a "no slots, leave your email" fallback for this case.
    return NextResponse.json({ slots: [] });
  }
}
