"use client";

import { useEffect, useState } from "react";
import type { Answers, ContactDetails } from "./questions";
import type { GateResult } from "./gate";
import type { FluentAnswers, FluentContactDetails } from "./questions-ai";
import type { FluentResult, Tier } from "./gate-ai";
import { copy } from "@/lib/copy";
import { fluentCopy } from "@/lib/copy-fluent";
import {
  FLUENT_INTRO_DURATION_MINUTES,
  canConfirmFluentBooking,
  getDefaultFluentFormat,
} from "@/lib/fluent-booking";

const TIMEZONE = "Africa/Johannesburg";

type DbgsBookingProps = {
  funnel?: "dbgs";
  contact: ContactDetails;
  answers: Answers;
  result: GateResult;
};

type FluentBookingProps = {
  funnel: "fluent";
  answers: FluentAnswers;
  result: FluentResult;
};

type DeliveryFormat = "in_person" | "remote";

function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    timeZone: TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-ZA", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function groupByDay(slots: string[]) {
  const groups = new Map<string, string[]>();
  for (const iso of slots) {
    const label = dayLabel(iso);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(iso);
  }
  return Array.from(groups.entries());
}

function DbgsBookingReveal({ contact, answers, result }: DbgsBookingProps) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/availability?duration=${result.callDurationMinutes}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load availability. Refresh and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [result.callDurationMinutes]);

  async function pickSlot(slot: string) {
    setBooking(true);
    setError(null);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, contact, answers, route: result.route }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.reason === "slot_taken") {
          setError(copy.booking.slotTaken);
          setSlots((prev) => (prev ? prev.filter((s) => s !== slot) : prev));
        } else {
          setError("Something went wrong booking that slot. Try another time.");
        }
        setBooking(false);
        return;
      }

      setBooked(true);
    } catch {
      setError("Something went wrong booking that slot. Try another time.");
    }
    setBooking(false);
  }

  if (booked) {
    return (
      <div className="max-w-[560px] mx-auto bg-white text-[var(--ink)] rounded-2xl overflow-hidden shadow-2xl p-8 text-center">
        <h3 className="display text-3xl mb-3">{copy.booking.confirmedHeadline}</h3>
        <p className="text-gray-600">
          {copy.booking.confirmedBody.replace("{duration}", String(result.callDurationMinutes))}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto bg-white text-[var(--ink)] rounded-2xl overflow-hidden shadow-2xl p-7">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#1fb8a0] mb-2">
        {result.externalLabel}
      </p>
      <h3 className="text-xl font-bold mb-2">{copy.booking.pickATime}</h3>
      <p className="text-sm text-gray-500 mb-5">
        {copy.booking.durationNote.replace("{duration}", String(result.callDurationMinutes))}
      </p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {slots === null && <p className="text-sm text-gray-500">{copy.booking.loadingSlots}</p>}

      {slots !== null && slots.length === 0 && (
        <p className="text-sm text-gray-500">{copy.booking.noSlots}</p>
      )}

      {slots !== null && slots.length > 0 && (
        <div className="space-y-5 max-h-[360px] overflow-y-auto">
          {groupByDay(slots).map(([day, daySlots]) => (
            <div key={day}>
              <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {day}
              </div>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    disabled={booking}
                    onClick={() => pickSlot(slot)}
                    className="pill-option border border-gray-200 rounded-lg px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {timeLabel(slot)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const TIER_DETAILS: Record<Tier, { name: string; price: string }> = {
  1: { name: "One session", price: "R2,000" },
  2: { name: "Two sessions", price: "R3,600" },
  3: { name: "Three sessions", price: "R4,500" },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FluentBookingReveal({ answers, result }: FluentBookingProps) {
  const defaultFormat = getDefaultFluentFormat(answers.context);
  const isPersonalUse = answers.context === "personal";
  const [format, setFormat] = useState<DeliveryFormat>(defaultFormat);
  const [contact, setContact] = useState<FluentContactDetails>({ name: "", email: "", mobile: "" });
  const [address, setAddress] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryEmail, setSummaryEmail] = useState("");
  const [summaryState, setSummaryState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const tier = TIER_DETAILS[result.recommendedTier];

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/availability?duration=${FLUENT_INTRO_DURATION_MINUTES}&format=${format}`)
      .then((response) => {
        if (!response.ok) throw new Error("availability_failed");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(fluentCopy.booking.availabilityError);
      });
    return () => {
      cancelled = true;
    };
  }, [format, result.sessionMinutes]);

  function chooseFormat(nextFormat: DeliveryFormat) {
    if (nextFormat === format) return;
    setFormat(nextFormat);
    setSlots(null);
    setSelectedSlot(null);
    setError(null);
  }

  function chooseSlot(slot: string) {
    if (format === "in_person" && address.trim() === "") return;
    setSelectedSlot(slot);
    setError(null);
  }

  async function emailSummary() {
    if (!EMAIL_PATTERN.test(summaryEmail.trim())) return;
    setSummaryState("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funnel: "fluent", mode: "summary", email: summaryEmail.trim(), answers }),
      });
      setSummaryState(response.ok ? "sent" : "error");
    } catch {
      setSummaryState("error");
    }
  }

  async function confirmSlot() {
    if (!selectedSlot || (format === "in_person" && address.trim() === "")) return;
    setBooking(true);
    setError(null);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnel: "fluent",
          slot: selectedSlot,
          contact,
          answers,
          result,
          format,
          address: format === "in_person" ? address.trim() : "",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.reason === "slot_taken") {
          setError(fluentCopy.booking.slotTaken);
          setSlots((current) =>
            current ? current.filter((item) => item !== selectedSlot) : current
          );
          setSelectedSlot(null);
        } else {
          setError(fluentCopy.booking.bookingError);
        }
        setBooking(false);
        return;
      }

      setBooked(true);
    } catch {
      setError(fluentCopy.booking.bookingError);
    }
    setBooking(false);
  }

  if (booked) {
    return (
      <div className="fluent-booking fluent-booking-confirmed" aria-live="polite">
        <p className="fluent-kicker">{fluentCopy.booking.confirmedEyebrow}</p>
        <h3 className="fluent-display">{fluentCopy.booking.confirmedHeadline}</h3>
        <p>{fluentCopy.booking.confirmedBody}</p>
      </div>
    );
  }

  const needsAddress = format === "in_person";
  const canChooseTime = !booking && (!needsAddress || address.trim() !== "");
  const canConfirm = canChooseTime && canConfirmFluentBooking({
    selectedSlot,
    format,
    address,
    contact,
  });

  return (
    <div className="fluent-booking">
      <div className="fluent-result">
        <p className="fluent-kicker">{fluentCopy.booking.resultEyebrow}</p>
        <h3 className="fluent-display">{result.headline}</h3>
        <p>{result.rationale}</p>
        <p className="fluent-credit-note">{fluentCopy.pricing.credit}</p>
        <p className="fluent-risk-note">{fluentCopy.pricing.riskReversal}</p>
        <button type="button" className="fluent-summary-link" onClick={() => setSummaryOpen(true)}>
          Email me this summary
        </button>
        {summaryOpen && (
          <div className="fluent-summary-capture">
            <label>
              <span>Email address</span>
              <input
                type="email"
                autoComplete="email"
                value={summaryEmail}
                onChange={(event) => setSummaryEmail(event.target.value)}
              />
            </label>
            <button type="button" onClick={emailSummary} disabled={!EMAIL_PATTERN.test(summaryEmail.trim()) || summaryState === "sending"}>
              {summaryState === "sending" ? "Sending..." : "Send summary"}
            </button>
            {summaryState === "sent" && <p>Your summary is on its way.</p>}
            {summaryState === "error" && <p>That did not send. Please try again.</p>}
          </div>
        )}
      </div>

      <div className="fluent-recommendation" aria-label="Recommended coaching package">
        <span>{fluentCopy.booking.recommendationLabel}</span>
        <strong>{tier.name}</strong>
        <p>{tier.price} · {result.sessionMinutes} minutes per session</p>
      </div>

      {result.recommendedTier === 1 && (
        <div className="fluent-package-options">
          <p>If you already know you want to keep going</p>
          <div>
            <span><strong>Two sessions</strong> R3,600 total</span>
            <span><strong>Three sessions</strong> R4,500 total</span>
          </div>
        </div>
      )}

      <fieldset className="fluent-format-choice">
        <legend>{fluentCopy.booking.formatLegend}</legend>
        <div className={isPersonalUse ? "is-personal" : ""}>
          {!isPersonalUse && (
            <button
              type="button"
              className={format === "in_person" ? "is-selected" : ""}
              aria-pressed={format === "in_person"}
              onClick={() => chooseFormat("in_person")}
            >
              <strong>{fluentCopy.booking.inPersonLabel}</strong>
              <span>{fluentCopy.booking.inPersonNote}</span>
            </button>
          )}
          <button
            type="button"
            className={format === "remote" ? "is-selected" : ""}
            aria-pressed={format === "remote"}
            onClick={() => chooseFormat("remote")}
          >
            <strong>{fluentCopy.booking.remoteLabel}</strong>
            <span>{fluentCopy.booking.remoteNote}</span>
          </button>
        </div>
        {isPersonalUse && format === "remote" && (
          <p className="fluent-in-person-request">
            In-person coaching is available in Cape Town on request.{" "}
            <button type="button" onClick={() => chooseFormat("in_person")}>Choose in person</button>
          </p>
        )}
        {isPersonalUse && format === "in_person" && (
          <button type="button" className="fluent-format-back" onClick={() => chooseFormat("remote")}>
            Use a remote call instead
          </button>
        )}
      </fieldset>

      {needsAddress && (
        <label className="fluent-address">
          <span>{fluentCopy.booking.addressLabel}</span>
          <input
            type="text"
            autoComplete="street-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={fluentCopy.booking.addressPlaceholder}
          />
          <small>{fluentCopy.booking.addressNote}</small>
        </label>
      )}

      <div className="fluent-slot-picker">
        <h4>{fluentCopy.booking.pickATime}</h4>
        <p className="fluent-booking-note">{fluentCopy.booking.selectTimeNote}</p>
        {error && <p className="fluent-booking-error">{error}</p>}
        {needsAddress && address.trim() === "" && (
          <p className="fluent-booking-note">{fluentCopy.booking.addressPrompt}</p>
        )}
        {slots === null && <p className="fluent-booking-note">{fluentCopy.booking.loadingSlots}</p>}
        {slots !== null && slots.length === 0 && (
          <p className="fluent-booking-note">{fluentCopy.booking.noSlots}</p>
        )}
        {slots !== null && slots.length > 0 && (
          <div className="fluent-slot-days">
            {groupByDay(slots).map(([day, daySlots]) => (
              <div className="fluent-slot-day" key={day}>
                <p>{day}</p>
                <div>
                  {daySlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={selectedSlot === slot ? "is-selected" : ""}
                      aria-pressed={selectedSlot === slot}
                      disabled={!canChooseTime}
                      onClick={() => chooseSlot(slot)}
                    >
                      {timeLabel(slot)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedSlot && (
          <div className="fluent-contact-grid">
            <p>Who should I book this call for?</p>
            <label>
              <span>Name</span>
              <input type="text" autoComplete="name" value={contact.name} onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label>
              <span>Email</span>
              <input type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label>
              <span>Mobile</span>
              <input type="tel" autoComplete="tel" value={contact.mobile} onChange={(event) => setContact((current) => ({ ...current, mobile: event.target.value }))} />
            </label>
          </div>
        )}
        {slots !== null && slots.length > 0 && (
          <div className="fluent-slot-confirmation" aria-live="polite">
            <div>
              <span>{fluentCopy.booking.selectedTimeLabel}</span>
              <strong>
                {selectedSlot
                  ? `${dayLabel(selectedSlot)} at ${timeLabel(selectedSlot)}`
                  : "Select a time above"}
              </strong>
            </div>
            <button
              type="button"
              className="fluent-button"
              disabled={!canConfirm}
              onClick={confirmSlot}
            >
              {booking ? fluentCopy.booking.confirmingTime : fluentCopy.booking.confirmTime}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function BookingReveal(props: DbgsBookingProps | FluentBookingProps) {
  if (props.funnel === "fluent") {
    return <FluentBookingReveal {...props} />;
  }
  return <DbgsBookingReveal {...props} />;
}
