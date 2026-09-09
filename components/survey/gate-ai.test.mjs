import assert from "node:assert/strict";
import test from "node:test";
import { evaluate, mechanicalScore } from "./gate-ai.ts";

const cases = [
  {
    label: "score 0 remains foundations even when paying",
    answers: { copyPaste: "avoid", screenshot: "not_sure", files: "no", passwords: "written", paying: "yes" },
    score: 0,
    band: "foundations",
    tier: 1,
    minutes: 60,
  },
  {
    label: "score 2 is the upper foundations boundary",
    answers: { copyPaste: "easy", screenshot: "not_sure", files: "no", passwords: "written", paying: "no" },
    score: 2,
    band: "foundations",
    tier: 1,
    minutes: 60,
  },
  {
    label: "score 3 is the lower gaps boundary",
    answers: { copyPaste: "easy", screenshot: "not_sure", files: "usually", passwords: "written", paying: "no" },
    score: 3,
    band: "gaps",
    tier: 3,
    minutes: 60,
  },
  {
    label: "score 5 stays gaps when paying",
    answers: { copyPaste: "easy", screenshot: "yes", files: "usually", passwords: "written", paying: "yes" },
    score: 5,
    band: "gaps",
    tier: 3,
    minutes: 60,
  },
  {
    label: "score 6 becomes ready when paying",
    answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "written", paying: "yes" },
    score: 6,
    band: "ready",
    tier: 2,
    minutes: 60,
  },
  {
    label: "score 6 stays gaps when not paying",
    answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "written", paying: "no" },
    score: 6,
    band: "gaps",
    tier: 3,
    minutes: 60,
  },
  {
    label: "score 7 becomes ready when paying",
    answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "browser", paying: "yes" },
    score: 7,
    band: "ready",
    tier: 2,
    minutes: 60,
  },
  {
    label: "score 8 stays gaps when payment is uncertain",
    answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "manager", paying: "not_sure" },
    score: 8,
    band: "gaps",
    tier: 3,
    minutes: 60,
  },
  {
    label: "score 8 becomes ready when paying",
    answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "manager", paying: "yes" },
    score: 8,
    band: "ready",
    tier: 2,
    minutes: 60,
  },
];

for (const testCase of cases) {
  test(testCase.label, () => {
    const result = evaluate(testCase.answers);
    assert.equal(mechanicalScore(testCase.answers), testCase.score);
    assert.equal(result.band, testCase.band);
    assert.equal(result.recommendedTier, testCase.tier);
    assert.equal(result.sessionMinutes, testCase.minutes);
  });
}
