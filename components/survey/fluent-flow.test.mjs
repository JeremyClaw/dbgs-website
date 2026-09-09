import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const assessmentSource = readFileSync(new URL("./FluentAssessment.tsx", import.meta.url), "utf8");
const bookingSource = readFileSync(new URL("./BookingReveal.tsx", import.meta.url), "utf8");
const bookingRouteSource = readFileSync(
  new URL("../../app/api/book/route.ts", import.meta.url),
  "utf8"
);

test("the recommendation appears without contact details", () => {
  assert.equal(assessmentSource.includes("FluentContactDetails"), false);
  assert.equal(assessmentSource.includes("/api/lead"), false);
  assert.equal(assessmentSource.includes("setResult(evaluate(answers))"), true);
});

test("contact details are collected after a time is selected", () => {
  const slotPosition = bookingSource.indexOf("{selectedSlot && (");
  const contactPosition = bookingSource.indexOf('autoComplete="name"');
  assert.notEqual(slotPosition, -1);
  assert.ok(contactPosition > slotPosition);
});

test("the booking notification contains answers, contact details, recommendation and chosen slot", () => {
  assert.equal(bookingRouteSource.includes("Assessment answers:"), true);
  assert.equal(bookingRouteSource.includes("Mobile: ${mobile}"), true);
  assert.equal(bookingRouteSource.includes("Recommendation: ${recommendation}"), true);
  assert.equal(bookingRouteSource.includes("Chosen slot: ${when}"), true);
});
