"use client";

import { useEffect, useState } from "react";
import type { ContactDetails } from "./questions";
import { copy } from "@/lib/copy";

const TIMEZONE = "Africa/Johannesburg";

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

export function BookingReveal({ contact }: { contact: ContactDetails }) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/availability")
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
  }, []);

  async function pickSlot(slot: string) {
    setBooking(true);
    setError(null);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, ...contact }),
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
        <p className="text-gray-600">{copy.booking.confirmedBody}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto bg-white text-[var(--ink)] rounded-2xl overflow-hidden shadow-2xl p-7">
      <h3 className="text-xl font-bold mb-5">{copy.booking.pickATime}</h3>

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
