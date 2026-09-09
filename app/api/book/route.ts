import { NextResponse } from "next/server";
import { evaluate } from "@/components/survey/gate";
import { evaluate as evaluateFluent } from "@/components/survey/gate-ai";
import type { FluentAnswers } from "@/components/survey/questions-ai";
import { createBookingEvent } from "@/lib/google/calendar";
import { sendNotification } from "@/lib/google/gmail";
import {
  FLUENT_INTRO_DURATION_MINUTES,
  getFluentBufferMinutes,
  getFluentFormatLabel,
  isFluentDeliveryFormat,
} from "@/lib/fluent-booking";

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

async function handleFluentBooking(body: Record<string, unknown>) {
  const slot = typeof body.slot === "string" ? body.slot : "";
  const answers = body.answers as FluentAnswers | undefined;
  const contact = body.contact as
    | { name?: string; email?: string; mobile?: string }
    | undefined;
  const format = isFluentDeliveryFormat(body.format) ? body.format : null;
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const { name, email, mobile } = contact ?? {};

  if (!slot || !name || !email || !mobile || !answers || !format) {
    return NextResponse.json({ error: "Missing slot, assessment, or contact details" }, { status: 400 });
  }

  if (format === "in_person" && !address) {
    return NextResponse.json({ error: "An address is required for an in-person call" }, { status: 400 });
  }

  const result = evaluateFluent(answers);
  const formatLabel = getFluentFormatLabel(format);
  const bufferMinutes = getFluentBufferMinutes(format);
  const eventDescription = `Fluent intro call.\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nFormat: ${formatLabel}${address ? `\nAddress: ${address}` : ""}\nRecommended package: ${result.recommendedTier} session${result.recommendedTier === 1 ? "" : "s"}\nCoaching session length: ${result.sessionMinutes} minutes\n\n${result.leadSummary}`;

  let booking;
  try {
    booking = await createBookingEvent({
      slot,
      name,
      email,
      externalLabel: "Fluent intro call",
      durationMinutes: FLUENT_INTRO_DURATION_MINUTES,
      bufferMinutes,
      eventTitle: `Fluent intro: ${name} (${formatLabel})`,
      eventDescription,
      location: format === "in_person" ? address : "Remote",
    });
  } catch (err) {
    console.error("[book:fluent] calendar insert failed", err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }

  if (!booking.success) {
    return NextResponse.json({ reason: booking.reason }, { status: 409 });
  }

  const when = formatSlotForEmail(slot);
  const recommendation = `${result.recommendedTier} session${result.recommendedTier === 1 ? "" : "s"}, ${result.sessionMinutes} minutes each`;

  try {
    await sendNotification({
      to: email,
      subject: "You're booked for your Fluent intro call",
      body: `Hi ${name},\n\nYou're confirmed for ${when} (South Africa time).\n\nFormat: ${formatLabel}${address ? `\nAddress: ${address}` : ""}\n\nYour assessment recommendation: ${recommendation}.\n\nA calendar invite is on its way separately.\n\nTalk soon,\nDeej`,
    });

    const opsBody = `Fluent booking confirmed.\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nWhen: ${when}\nFormat: ${formatLabel}${address ? `\nAddress: ${address}` : ""}\nBuffer: ${bufferMinutes} minutes\nRecommendation: ${recommendation}\n\n${result.leadSummary}`;
    const notification = {
      subject: `Fluent booking confirmed: ${name}`,
      body: opsBody,
    };
    await sendNotification({ to: process.env.OPS_EMAIL as string, ...notification });
    await sendNotification({ to: process.env.DEEJ_EMAIL as string, ...notification });
  } catch (err) {
    console.error("[book:fluent] confirmation email failed", err);
  }

  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body?.funnel === "fluent") return handleFluentBooking(body);
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
    // Calendar invite from sendUpdates: 'all'. Do not fail the booking over this.
  }

  return NextResponse.json({ ok: true });
}
