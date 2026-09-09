import assert from "node:assert/strict";
import test from "node:test";
import { evaluate } from "./gate.ts";

test("a strong DBGS lead keeps the growth partner route", () => {
  const result = evaluate({
    revenue: "150k_plus",
    store: "shopify",
    demandSignal: "repeat_bestsellers",
    content: "engine",
    urgency: "this_month",
    budgetExpectation: "realistic",
    investment: "ready",
    helpNeeded: "management",
    bottleneck: "direction",
    adSpend: "50k_plus",
  });
  assert.equal(result.pass, true);
  assert.equal(result.route, "growth_partner");
  assert.equal(result.callDurationMinutes, 30);
});

test("a low intent DBGS lead keeps the quick fit route", () => {
  const result = evaluate({ investment: "not_ready", helpNeeded: "free_advice" });
  assert.equal(result.pass, true);
  assert.equal(result.route, "quick_fit");
  assert.equal(result.callDurationMinutes, 15);
});
