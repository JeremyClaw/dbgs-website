import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google/calendar";

export async function GET() {
  try {
    const slots = await getAvailableSlots();
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("[availability] failed to load calendar free/busy", err);
    // Degrade to an empty list rather than breaking the client — BookingReveal
    // already shows a "no slots, leave your email" fallback for this case.
    return NextResponse.json({ slots: [] });
  }
}
