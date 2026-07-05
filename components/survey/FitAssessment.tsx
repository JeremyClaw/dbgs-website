"use client";

import { useState } from "react";
import { questions, type Answers, type ContactDetails } from "./questions";
import { evaluate, type GateResult } from "./gate";
import { BookingReveal } from "./BookingReveal";
import { DeclineState } from "./DeclineState";

const TOTAL_STEPS = questions.length + 1; // + contact step

export function FitAssessment() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<ContactDetails>({ name: "", email: "", company: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GateResult | null>(null);

  const isContactStep = stepIndex === questions.length;
  const progress = Math.round(((stepIndex + 1) / TOTAL_STEPS) * 100);

  function selectAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setStepIndex((i) => Math.min(TOTAL_STEPS - 1, i + 1));
  }

  async function submit() {
    setSubmitting(true);
    const gateResult = evaluate(answers);
    setResult(gateResult);

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, contact, pass: gateResult.pass, reason: gateResult.reason }),
      });
    } catch {
      // Non-fatal — the gate result still renders below even if the notify email fails.
    }

    setSubmitting(false);
  }

  if (result) {
    return result.pass ? (
      <BookingReveal contact={contact} />
    ) : (
      <DeclineState contact={contact} />
    );
  }

  const currentQuestion = !isContactStep ? questions[stepIndex] : null;
  const canProceed = isContactStep
    ? contact.name.trim() !== "" && contact.email.trim() !== ""
    : Boolean(currentQuestion && answers[currentQuestion.id]);

  return (
    <div className="max-w-[560px] mx-auto bg-white text-[var(--ink)] rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-7 pt-7">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Step {stepIndex + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-[11px] font-bold text-[#1fb8a0]">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div className="h-full rounded-full grad-btn" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-7 pb-7">
        {currentQuestion && (
          <>
            <h3 className="text-xl font-bold mb-1">{currentQuestion.question}</h3>
            {currentQuestion.subtext && (
              <p className="text-sm text-gray-500 mb-5">{currentQuestion.subtext}</p>
            )}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectAnswer(currentQuestion.id, option.value)}
                    className={`pill-option w-full text-left border rounded-xl px-5 py-4 text-sm cursor-pointer ${
                      selected ? "selected border-2 font-semibold" : "border-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {isContactStep && (
          <>
            <h3 className="text-xl font-bold mb-1">Last thing, who should we send this to?</h3>
            <p className="text-sm text-gray-500 mb-5">
              We will not add you to a newsletter. This is just so we know who is booking.
            </p>
            <div className="space-y-3 mb-8">
              <input
                type="text"
                placeholder="Your name"
                value={contact.name}
                onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm"
              />
              <input
                type="email"
                placeholder="you@business.com"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={contact.company}
                onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm"
              />
            </div>
          </>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="text-xs font-bold text-gray-400 uppercase tracking-widest disabled:opacity-0"
          >
            ← Back
          </button>
          {isContactStep ? (
            <button
              type="button"
              onClick={submit}
              disabled={!canProceed || submitting}
              className="grad-btn text-white text-xs font-bold px-7 py-3.5 rounded-full disabled:opacity-50"
            >
              {submitting ? "Checking..." : "See My Result →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed}
              className="grad-btn text-white text-xs font-bold px-7 py-3.5 rounded-full disabled:opacity-50"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
