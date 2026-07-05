import type { Answers } from "./questions";

// Named constants so Deej can retune the bar without touching UI code.
const REVENUE_TIERS = ["under_20k", "20k_60k", "60k_150k", "150k_plus"] as const;
const MIN_PASSING_REVENUE_TIER = 2; // "60k_150k" (Scaling) or above
const ESTABLISHED_REVENUE_TIER = 3; // "150k_plus"

const PASSING_STORE_VALUES = ["shopify"] as const; // strict default — see Design Decision 4a follow-up
const PASSING_CONTENT_VALUES = ["steady", "engine"] as const;

// workingStyle is informational only, shown to Deej ahead of the call, not gated —
// the content-capacity question already captures whether they can resource creative.

export type GateResult = {
  pass: boolean;
  reason: string;
};

export function evaluate(answers: Answers): GateResult {
  const revenueTier = REVENUE_TIERS.indexOf(answers.revenue as (typeof REVENUE_TIERS)[number]);

  if (revenueTier < MIN_PASSING_REVENUE_TIER) {
    return { pass: false, reason: "revenue_below_threshold" };
  }

  // Ad spend only fails the gate on an explicit "under R10k/month" answer,
  // and only when revenue is below the Established tier. "Not running yet"
  // or R10k+ always pass once revenue already qualifies.
  if (answers.adSpend === "under_10k" && revenueTier < ESTABLISHED_REVENUE_TIER) {
    return { pass: false, reason: "adspend_below_threshold" };
  }

  if (!PASSING_STORE_VALUES.includes(answers.store as (typeof PASSING_STORE_VALUES)[number])) {
    return { pass: false, reason: "store_not_qualifying" };
  }

  if (!PASSING_CONTENT_VALUES.includes(answers.content as (typeof PASSING_CONTENT_VALUES)[number])) {
    return { pass: false, reason: "content_capacity_below_threshold" };
  }

  return { pass: true, reason: "pass" };
}
