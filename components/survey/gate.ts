import type { Answers } from "./questions";

// Named constants so Deej can retune the routing without touching UI code.
const REVENUE_TIERS = ["under_20k", "20k_60k", "60k_150k", "150k_plus"] as const;
const SCALING_REVENUE_TIER = 2; // "60k_150k"
const ESTABLISHED_REVENUE_TIER = 3; // "150k_plus"

const LIVE_STORE_VALUES = ["shopify", "other_platform"] as const;
const STRONG_DEMAND_SIGNAL_VALUES = ["online_consistent", "repeat_bestsellers"] as const;
const REAL_DEMAND_SIGNAL_VALUES = ["offline_signal", "online_consistent", "repeat_bestsellers"] as const;
const STRONG_CONTENT_VALUES = ["steady", "engine"] as const;
const CLEAR_INTENT_VALUES = ["this_month", "30_60"] as const;

export type LeadRoute = "growth_partner" | "audit_setup" | "quick_fit";

export type GateResult = {
  pass: boolean;
  route: LeadRoute;
  callDurationMinutes: 0 | 15 | 30;
  routeLabel: string;
  reason: string;
};

export function evaluate(answers: Answers): GateResult {
  const revenueTier = REVENUE_TIERS.indexOf(answers.revenue as (typeof REVENUE_TIERS)[number]);
  const hasLiveStore = LIVE_STORE_VALUES.includes(answers.store as (typeof LIVE_STORE_VALUES)[number]);
  const hasStrongDemand = STRONG_DEMAND_SIGNAL_VALUES.includes(
    answers.demandSignal as (typeof STRONG_DEMAND_SIGNAL_VALUES)[number]
  );
  const hasRealDemand = REAL_DEMAND_SIGNAL_VALUES.includes(
    answers.demandSignal as (typeof REAL_DEMAND_SIGNAL_VALUES)[number]
  );
  const hasStrongContent = STRONG_CONTENT_VALUES.includes(
    answers.content as (typeof STRONG_CONTENT_VALUES)[number]
  );
  const hasClearIntent = CLEAR_INTENT_VALUES.includes(
    answers.urgency as (typeof CLEAR_INTENT_VALUES)[number]
  );
  const hasRealisticGrowthExpectation = answers.budgetExpectation !== "small_budget_big_jump";
  const isReadyToInvest = answers.investment === "ready";
  const isOpenToInvesting = answers.investment === "ready" || answers.investment === "maybe";
  const wantsManagement = answers.helpNeeded === "management";
  const wantsAuditOrSetup =
    answers.helpNeeded === "audit_setup" ||
    answers.bottleneck === "cro" ||
    answers.bottleneck === "tracking" ||
    answers.bottleneck === "direction";

  if (answers.investment === "not_ready" || answers.helpNeeded === "free_advice") {
    return {
      pass: true,
      route: "quick_fit",
      callDurationMinutes: 15,
      routeLabel: "Quick fit call",
      reason: "low_commercial_intent",
    };
  }

  if (
    revenueTier >= SCALING_REVENUE_TIER &&
    hasLiveStore &&
    hasStrongDemand &&
    hasStrongContent &&
    hasClearIntent &&
    hasRealisticGrowthExpectation &&
    isReadyToInvest &&
    wantsManagement &&
    (answers.adSpend !== "under_10k" || revenueTier >= ESTABLISHED_REVENUE_TIER)
  ) {
    return {
      pass: true,
      route: "growth_partner",
      callDurationMinutes: 30,
      routeLabel: "Growth partner call",
      reason: "management_fit",
    };
  }

  if (
    hasLiveStore &&
    isOpenToInvesting &&
    hasClearIntent &&
    hasRealisticGrowthExpectation &&
    (wantsAuditOrSetup || hasRealDemand)
  ) {
    return {
      pass: true,
      route: "audit_setup",
      callDurationMinutes: 30,
      routeLabel: "Audit, setup or CRO call",
      reason: "audit_setup_fit",
    };
  }

  if (isOpenToInvesting) {
    return {
      pass: true,
      route: "quick_fit",
      callDurationMinutes: 15,
      routeLabel: "Quick fit call",
      reason: "early_or_unclear_but_commercial",
    };
  }

  return {
    pass: true,
    route: "quick_fit",
    callDurationMinutes: 15,
    routeLabel: "Quick fit call",
    reason: "default_quick_fit",
  };
}
