import { NextResponse } from "next/server";
import { evaluate } from "@/components/survey/gate";
import { getAnswerLabel, getQuestionLabel } from "@/components/survey/questions";
import { sendNotification } from "@/lib/google/gmail";

export async function POST(request: Request) {
  const body = await request.json();
  const { answers, contact, reason: clientReason } = body ?? {};

  if (!answers || !contact?.email) {
    return NextResponse.json({ error: "Missing answers or contact details" }, { status: 400 });
  }

  // Re-run the gate server-side. Never trust the client's pass/fail for routing.
  const { pass, reason, routeLabel, leadQualitySummary, callDurationMinutes } = evaluate(answers);

  console.log("[lead]", {
    name: contact.name,
    email: contact.email,
    company: contact.company,
    pass,
    reason,
    routeLabel,
    callDurationMinutes,
    clientReason,
    answers,
  });

  const summary = `New fit assessment submission\n\nLead quality: ${leadQualitySummary}\n\nName: ${contact.name}\nEmail: ${contact.email}\nCompany: ${contact.company || "(not given)"}\nStore: ${contact.storeUrl || "(not given)"}\nInstagram: ${contact.instagram || "(not given)"}\n\nRoute: ${routeLabel} (${reason})\nDuration: ${callDurationMinutes} minutes\n\nAnswers:\n${Object.entries(
    answers
  )
    .map(([k, v]) => `- ${getQuestionLabel(k)}: ${getAnswerLabel(k, String(v))}`)
    .join("\n")}`;

  try {
    await sendNotification({
      to: process.env.OPS_EMAIL as string,
      subject: `Fit assessment (${routeLabel}): ${contact.name}`,
      body: summary,
    });

    if (pass) {
      await sendNotification({
        to: process.env.DEEJ_EMAIL as string,
        subject: `Qualified lead: ${contact.name}${contact.company ? ` (${contact.company})` : ""}`,
        body: summary,
      });
    }
  } catch (err) {
    console.error("[lead] notification email failed", err);
    // Do not fail the request — the client flow must not break on a mail-send error.
  }

  return NextResponse.json({ ok: true, pass, reason });
}
