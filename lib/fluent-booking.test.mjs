import assert from "node:assert/strict";
import test from "node:test";
import {
  FLUENT_INTRO_DURATION_MINUTES,
  getFluentBufferMinutes,
  getFluentFormatLabel,
  isFluentDeliveryFormat,
  overlapsWithBuffer,
} from "./fluent-booking.ts";

test("Fluent always books a 15-minute intro call", () => {
  assert.equal(FLUENT_INTRO_DURATION_MINUTES, 15);
});

test("remote and in-person formats have the required buffers", () => {
  assert.equal(getFluentBufferMinutes("remote"), 15);
  assert.equal(getFluentBufferMinutes("in_person"), 60);
  assert.equal(getFluentFormatLabel("remote"), "Remote");
  assert.equal(getFluentFormatLabel("in_person"), "In person");
});

test("only supported delivery formats are accepted", () => {
  assert.equal(isFluentDeliveryFormat("remote"), true);
  assert.equal(isFluentDeliveryFormat("in_person"), true);
  assert.equal(isFluentDeliveryFormat("hybrid"), false);
});

test("a meeting 45 minutes after a call is clear remotely but blocked in person", () => {
  const slot = {
    start: new Date("2026-09-08T09:00:00+02:00"),
    end: new Date("2026-09-08T09:15:00+02:00"),
  };
  const busy = {
    start: new Date("2026-09-08T10:00:00+02:00"),
    end: new Date("2026-09-08T10:30:00+02:00"),
  };

  assert.equal(overlapsWithBuffer(slot, busy, 15), false);
  assert.equal(overlapsWithBuffer(slot, busy, 60), true);
});
