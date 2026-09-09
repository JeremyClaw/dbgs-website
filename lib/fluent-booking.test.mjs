import assert from "node:assert/strict";
import test from "node:test";
import {
  FLUENT_INTRO_DURATION_MINUTES,
  canConfirmFluentBooking,
  getFluentBufferMinutes,
  getDefaultFluentFormat,
  getFluentFormatLabel,
  getFluentSlotMinutesForDay,
  isFluentDeliveryFormat,
  overlapsWithBuffer,
  packageBalanceAfterFirstSession,
} from "./fluent-booking.ts";

test("Fluent always books a 15-minute intro call", () => {
  assert.equal(FLUENT_INTRO_DURATION_MINUTES, 15);
});

test("personal use defaults to remote and other uses keep the in-person path", () => {
  assert.equal(getDefaultFluentFormat("personal"), "remote");
  assert.equal(getDefaultFluentFormat("work"), "in_person");
  assert.equal(getDefaultFluentFormat("both"), "in_person");
});

test("the first session is credited only within 48 hours", () => {
  assert.equal(packageBalanceAfterFirstSession(2, 48), 1600);
  assert.equal(packageBalanceAfterFirstSession(3, 48), 2500);
  assert.equal(packageBalanceAfterFirstSession(2, 49), null);
  assert.equal(packageBalanceAfterFirstSession(3, 49), null);
});

test("coaching offers weekday morning and evening times plus Saturday morning", () => {
  assert.deepEqual(getFluentSlotMinutesForDay(1), [540, 1050]);
  assert.deepEqual(getFluentSlotMinutesForDay(5), [540, 1050]);
  assert.deepEqual(getFluentSlotMinutesForDay(6), [540, 615]);
  assert.deepEqual(getFluentSlotMinutesForDay(0), []);
});

test("a selected time is not confirmed until contact details are complete", () => {
  const base = {
    selectedSlot: "2026-09-12T07:00:00.000Z",
    format: "remote",
    address: "",
  };
  assert.equal(canConfirmFluentBooking({ ...base, contact: { name: "", email: "", mobile: "" } }), false);
  assert.equal(canConfirmFluentBooking({ ...base, contact: { name: "Deej", email: "bad", mobile: "0820000000" } }), false);
  assert.equal(canConfirmFluentBooking({ ...base, contact: { name: "Deej", email: "deej@example.com", mobile: "0820000000" } }), true);
});

test("an in-person booking also needs an address", () => {
  const contact = { name: "Deej", email: "deej@example.com", mobile: "0820000000" };
  assert.equal(canConfirmFluentBooking({ selectedSlot: "2026-09-12T07:00:00.000Z", format: "in_person", address: "", contact }), false);
  assert.equal(canConfirmFluentBooking({ selectedSlot: "2026-09-12T07:00:00.000Z", format: "in_person", address: "Cape Town", contact }), true);
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
