import { NextResponse } from "next/server";
import { evaluate } from "@/components/survey/gate";
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
  const { slot, contact, answers, route } = body ?? {};
  const { name, email, company } = contact ?? {};

  if (!slot || !name || !email || !answers) {
    return NextResponse.json({ error: "Missing slot, qualification, or contact details" }, { status: 400 });
  }

  const gate = evaluate(answers);
  if (!gate.pass) {
    console.warn("[book] blocked unqualified booking attempt", {
      email,
      company,
      reason: gate.reason,
    });
    return NextResponse.json({ error: "Lead is not qualified", reason: gate.reason }, { status: 403 });
  }

  if (route && route !== gate.route) {
    return NextResponse.json({ error: "Lead route mismatch", reason: gate.reason }, { status: 403 });
  }

  let result;
  try {
    result = await createBookingEvent({
      slot,
      name,
      email,
      company,
      storeUrl: contact.storeUrl,
      instagram: contact.instagram,
      externalLabel: gate.externalLabel,
      durationMinutes: gate.callDurationMinutes,
    });
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

  const opsBody = `Booking confirmed.\n\nLead quality: ${gate.leadQualitySummary}\n\nType: ${gate.routeLabel}\nDuration: ${gate.callDurationMinutes} minutes\nName: ${name}\nEmail: ${email}\nCompany: ${company || "(not given)"}\nStore: ${contact.storeUrl || "(not given)"}\nInstagram: ${contact.instagram || "(not given)"}\nWhen: ${when}`;

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
