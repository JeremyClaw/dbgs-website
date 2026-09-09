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
    label: "no paid tool starts with one session even with some computer confidence",
    answers: { copyPaste: "easy", screenshot: "not_sure", files: "usually", passwords: "written", paying: "no", tried: ["chatgpt"], hourlyValue: "3000_plus" },
    score: 3,
    band: "foundations",
    tier: 1,
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
    label: "a low hourly value starts with one session",
    answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "written", paying: "yes", tried: ["chatgpt"], hourlyValue: "500_1500" },
    score: 6,
    band: "foundations",
    tier: 1,
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
    label: "no tools used starts with one session",
    answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "manager", paying: "yes", tried: ["none"], hourlyValue: "3000_plus" },
    score: 8,
    band: "foundations",
    tier: 1,
    minutes: 60,
  },
  {
    label: "a confident paid user receives a two-session recommendation",
    answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "manager", paying: "yes", tried: ["chatgpt"], blocker: "no_time", hourlyValue: "3000_plus" },
    score: 8,
    band: "ready",
    tier: 2,
    minutes: 60,
  },
];

cases.push({
  label: "a paid user with a few gaps can receive a three-session recommendation",
  answers: { copyPaste: "easy", screenshot: "not_sure", files: "usually", passwords: "browser", paying: "yes", tried: ["chatgpt"], blocker: "no_time", hourlyValue: "1500_3000" },
  score: 4,
  band: "gaps",
  tier: 3,
  minutes: 60,
});

cases.push({
  label: "too technical starts with one session regardless of computer score",
  answers: { copyPaste: "easy", screenshot: "yes", files: "yes", passwords: "manager", paying: "yes", tried: ["chatgpt"], blocker: "too_technical", hourlyValue: "3000_plus" },
  score: 8,
  band: "foundations",
  tier: 1,
  minutes: 60,
});

for (const testCase of cases) {
  test(testCase.label, () => {
    const result = evaluate(testCase.answers);
    assert.equal(mechanicalScore(testCase.answers), testCase.score);
    assert.equal(result.band, testCase.band);
    assert.equal(result.recommendedTier, testCase.tier);
    assert.equal(result.sessionMinutes, testCase.minutes);
  });
}
