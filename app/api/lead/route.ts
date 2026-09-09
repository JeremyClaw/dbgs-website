import { NextResponse } from "next/server";
import { evaluate } from "@/components/survey/gate";
import { evaluate as evaluateFluent } from "@/components/survey/gate-ai";
import { getAnswerLabel, getQuestionLabel } from "@/components/survey/questions";
import { sendNotification } from "@/lib/google/gmail";

async function handleFluentLead(body: Record<string, unknown>) {
  const answers = body.answers as Record<string, string | string[]> | undefined;
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (body.mode !== "summary" || !answers || !email) {
    return NextResponse.json({ error: "Missing assessment or email address" }, { status: 400 });
  }

  const result = evaluateFluent(answers);
  const recommendation = `${result.recommendedTier} session${result.recommendedTier === 1 ? "" : "s"}, R${result.recommendedTier === 1 ? "2,000" : result.recommendedTier === 2 ? "3,600" : "4,500"}`;

  try {
    await sendNotification({
      to: email,
      subject: "Your AI, made clear recommendation",
      body: `Your recommendation\n\n${result.headline}\n${result.rationale}\n\nRecommended: ${recommendation}\nEvery paid session lasts 60 minutes.\n\n${result.recommendedTier === 1 ? "If you book a package within 48 hours of your first session, the R2,000 already paid becomes its first session. You pay only the balance." : ""}\n\nIf your first session is not useful, you do not pay for any further sessions.\n\nDeej Burke\nAI, made clear`,
    });
  } catch (err) {
    console.error("[lead:fluent] summary email failed", err);
    return NextResponse.json({ error: "Summary email failed" }, { status: 500 });
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
