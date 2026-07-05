import { NextResponse } from "next/server";
import { createBookingEvent } from "@/lib/google/calendar";
import { sendNotification } from "@/lib/google/gmail";

function formatSlotForEmail(slot: string) {
  return new Date(slot).toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { slot, name, email, company } = body ?? {};

  if (!slot || !name || !email) {
    return NextResponse.json({ error: "Missing slot or contact details" }, { status: 400 });
  }

  let result;
  try {
    result = await createBookingEvent({ slot, name, email, company });
  } catch (err) {
    console.error("[book] calendar insert failed", err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }

  if (!result.success) {
    return NextResponse.json({ reason: result.reason }, { status: 409 });
  }

  const when = formatSlotForEmail(slot);

  try {
    await sendNotification({
      to: email,
      subject: "You're booked with DB Growth Solutions",
      body: `Hi ${name},\n\nYou're confirmed for ${when} (South Africa time). A calendar invite is on its way separately.\n\nTalk soon,\nDeej`,
    });

    const opsBody = `Booking confirmed.\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || "(not given)"}\nWhen: ${when}`;

    await sendNotification({
      to: process.env.OPS_EMAIL as string,
      subject: `Booking confirmed: ${name}`,
      body: opsBody,
    });

    await sendNotification({
      to: process.env.DEEJ_EMAIL as string,
      subject: `Booking confirmed: ${name}`,
      body: opsBody,
    });
  } catch (err) {
    console.error("[book] confirmation email failed", err);
    // The calendar event is already created and the lead already has the Google
    // Calendar invite from sendUpdates: 'all' — do not fail the booking over this.
  }

  return NextResponse.json({ ok: true });
}
