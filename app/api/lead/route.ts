import { NextResponse } from "next/server";
import { evaluate } from "@/components/survey/gate";
import { evaluate as evaluateFluent } from "@/components/survey/gate-ai";
import { getAnswerLabel, getQuestionLabel } from "@/components/survey/questions";
import {
  getFluentAnswerLabel,
  getFluentQuestionLabel,
  type FluentAnswer,
} from "@/components/survey/questions-ai";
import { sendNotification } from "@/lib/google/gmail";

async function handleFluentLead(body: Record<string, unknown>) {
  const answers = body.answers as Record<string, string | string[]> | undefined;
  const contact = body.contact as
    | { name?: string; email?: string; mobile?: string }
    | undefined;

  if (!answers || !contact?.email || !contact.name || !contact.mobile) {
    return NextResponse.json({ error: "Missing answers or contact details" }, { status: 400 });
  }

  const result = evaluateFluent(answers);
  const answerLines = Object.entries(answers)
    .map(
      ([key, value]) =>
        `- ${getFluentQuestionLabel(key)}: ${getFluentAnswerLabel(key, value as FluentAnswer)}`
    )
    .join("\n");
  const summary = `New Fluent assessment submission\n\nRecommendation: ${result.recommendedTier} session${result.recommendedTier === 1 ? "" : "s"}\nSession length: ${result.sessionMinutes} minutes\nLead summary: ${result.leadSummary}\n\nName: ${contact.name}\nEmail: ${contact.email}\nMobile: ${contact.mobile}\n\nAnswers:\n${answerLines}`;

  console.log("[lead:fluent]", {
    name: contact.name,
    email: contact.email,
    recommendedTier: result.recommendedTier,
    sessionMinutes: result.sessionMinutes,
  });

  try {
    const notification = {
      subject: `Fluent assessment: ${contact.name}`,
      body: summary,
    };
    await sendNotification({ to: process.env.OPS_EMAIL as string, ...notification });
    await sendNotification({ to: process.env.DEEJ_EMAIL as string, ...notification });
  } catch (err) {
    console.error("[lead:fluent] notification email failed", err);
  }

  return NextResponse.json({
    ok: true,
    recommendedTier: result.recommendedTier,
    sessionMinutes: result.sessionMinutes,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body?.funnel === "fluent") return handleFluentLead(body);
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
    // Do not fail the request. The client flow must not break on a mail-send error.
  }

  return NextResponse.json({ ok: true, pass, reason });
}
