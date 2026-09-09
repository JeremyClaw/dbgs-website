import type { FluentAnswers } from "./questions-ai";

export type Band = "ready" | "gaps" | "foundations";
export type Tier = 1 | 2 | 3;

export type FluentResult = {
  band: Band;
  recommendedTier: Tier;
  sessionMinutes: 60;
  headline: string;
  rationale: string;
  leadSummary: string;
};

const MECHANICAL_POINTS: Record<string, Record<string, number>> = {
  copyPaste: { easy: 2, know_how: 1, avoid: 0 },
  screenshot: { yes: 2, not_sure: 0 },
  files: { yes: 2, usually: 1, no: 0 },
  passwords: { manager: 2, browser: 1, written: 0 },
};

function stringAnswer(answers: FluentAnswers, key: string) {
  const answer = answers[key];
  return typeof answer === "string" ? answer : "";
}

export function mechanicalScore(answers: FluentAnswers) {
  return Object.entries(MECHANICAL_POINTS).reduce((total, [questionId, points]) => {
    return total + (points[stringAnswer(answers, questionId)] ?? 0);
  }, 0);
}

function leadSummary(answers: FluentAnswers, score: number, band: Band) {
  const tried = answers.tried;
  const toolsOpened = Array.isArray(tried) ? tried.join(", ") : tried || "not given";

  return [
    `Band: ${band}`,
    `Mechanical score: ${score}/8`,
    `Pays for AI: ${stringAnswer(answers, "paying") || "not given"}`,
    `Tools opened: ${toolsOpened}`,
    `First use case: ${stringAnswer(answers, "useCase") || "not given"}`,
    `Main blocker: ${stringAnswer(answers, "blocker") || "not given"}`,
    `Hourly value: ${stringAnswer(answers, "hourlyValue") || "not given"}`,
    `Use: ${stringAnswer(answers, "context") || "not given"}`,
  ].join("; ");
}

export function evaluate(answers: FluentAnswers): FluentResult {
  const score = mechanicalScore(answers);
  const paying = stringAnswer(answers, "paying");
  const tried = answers.tried;
  const hasUsedNoTools = Array.isArray(tried) ? tried.includes("none") : tried === "none";
  const blocker = stringAnswer(answers, "blocker");
  const hourlyValue = stringAnswer(answers, "hourlyValue");
  const shouldStartWithOne =
    hasUsedNoTools ||
    paying !== "yes" ||
    blocker === "too_technical" ||
    hourlyValue === "under_500" ||
    hourlyValue === "500_1500" ||
    score <= 2;

  if (shouldStartWithOne) {
    const band = "foundations";
    return {
      band,
      recommendedTier: 1,
      sessionMinutes: 60,
      headline: "Let us start with one session and see how it goes.",
      rationale: "One session, R2,000, no commitment. Start with one useful result, then decide.",
      leadSummary: leadSummary(answers, score, band),
    };
  }

  if (score >= 6 && paying === "yes") {
    const band = "ready";
    return {
      band,
      recommendedTier: 2,
      sessionMinutes: 60,
      headline: "You already know the basics.",
      rationale: "What you are missing is direction, not training. Two sessions is probably enough.",
      leadSummary: leadSummary(answers, score, band),
    };
  }

  const band = "gaps";
  return {
    band,
    recommendedTier: 3,
    sessionMinutes: 60,
    headline: "You are closer than you think.",
    rationale:
      "Three sessions is the right starting point. The first gets the basics working, and the next two help you apply them to the tasks that matter.",
    leadSummary: leadSummary(answers, score, band),
  };
}
