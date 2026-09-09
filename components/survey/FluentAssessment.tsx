"use client";

import { useEffect, useRef, useState } from "react";
import { BookingReveal } from "./BookingReveal";
import type { FluentResult } from "./gate-ai";
import type {
  FluentAnswers,
  FluentContactDetails,
  FluentQuestion,
  FluentQuestionScreen,
} from "./questions-ai";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FluentAssessmentProps = {
  screens: FluentQuestionScreen[];
  evaluate: (answers: FluentAnswers) => FluentResult;
};

function hasAnswer(question: FluentQuestion, answers: FluentAnswers) {
  if (question.optional) return true;
  const answer = answers[question.id];
  return Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
}

export function FluentAssessment({ screens, evaluate }: FluentAssessmentProps) {
  const flowTopRef = useRef<HTMLDivElement>(null);
  const hasRendered = useRef(false);
  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<FluentAnswers>({});
  const [contact, setContact] = useState<FluentContactDetails>({ name: "", email: "", mobile: "" });
  const [result, setResult] = useState<FluentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isContactStep = screenIndex === screens.length;
  const screen = isContactStep ? null : screens[screenIndex];
  const progress = isContactStep ? 100 : Math.round(((screenIndex + 1) / screens.length) * 100);
  const canProceed = screen
    ? screen.questions.every((question) => hasAnswer(question, answers))
    : contact.name.trim() !== "" &&
      EMAIL_PATTERN.test(contact.email.trim()) &&
      contact.mobile.trim() !== "";

  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      flowTopRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [screenIndex, result]);

  function selectSingle(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function toggleMultiple(questionId: string, value: string) {
    setAnswers((current) => {
      const existing = Array.isArray(current[questionId]) ? current[questionId] : [];
      if (value === "none") {
        return { ...current, [questionId]: existing.includes("none") ? [] : ["none"] };
      }

      const withoutNone = existing.filter((item) => item !== "none");
      const next = withoutNone.includes(value)
        ? withoutNone.filter((item) => item !== value)
        : [...withoutNone, value];
      return { ...current, [questionId]: next };
    });
  }

  function goBack() {
    setScreenIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setScreenIndex((current) => Math.min(screens.length, current + 1));
  }

  async function submit() {
    if (!canProceed) return;
    setSubmitting(true);
    const gateResult = evaluate(answers);
    setResult(gateResult);

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funnel: "fluent", answers, contact, result: gateResult }),
      });
    } catch {
      // The result remains useful if the notification email is temporarily unavailable.
    }

    setSubmitting(false);
  }

  if (result) {
    return (
      <div ref={flowTopRef} className="fluent-assessment-flow-top">
        <BookingReveal
          funnel="fluent"
          contact={contact}
          answers={answers}
          result={result}
        />
      </div>
    );
  }

  return (
    <div ref={flowTopRef} className="fluent-assessment" aria-live="polite">
      <div className="fluent-assessment-progress">
        <div>
          <span>{isContactStep ? "Assessment complete" : `Section ${screenIndex + 1} of ${screens.length}`}</span>
          <span>{progress}%</span>
        </div>
        <div className="fluent-progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      {screen && (
        <div>
          <h3 className="fluent-assessment-title">{screen.title}</h3>
          {screen.intro && <p className="fluent-assessment-intro">{screen.intro}</p>}
          <div className="fluent-question-list">
            {screen.questions.map((question) => {
              const answer = answers[question.id];
              return (
                <fieldset className="fluent-question" key={question.id}>
                  <legend>{question.question}</legend>
                  {question.kind === "multiple" && (
                    <p className="fluent-question-note">Choose every answer that applies.</p>
                  )}
                  {question.kind === "text" ? (
                    <div>
                      <label className="sr-only" htmlFor={`fluent-${question.id}`}>
                        {question.question}
                      </label>
                      <textarea
                        id={`fluent-${question.id}`}
                        maxLength={question.maxLength}
                        placeholder="A sentence is enough"
                        value={typeof answer === "string" ? answer : ""}
                        onChange={(event) => selectSingle(question.id, event.target.value)}
                      />
                      <p className="fluent-character-count">
                        {typeof answer === "string" ? answer.length : 0}/{question.maxLength}
                      </p>
                    </div>
                  ) : (
                    <div className="fluent-options">
                      {question.options?.map((option) => {
                        const selected = Array.isArray(answer)
                          ? answer.includes(option.value)
                          : answer === option.value;
                        return (
                          <button
                            type="button"
                            className={selected ? "is-selected" : ""}
                            aria-pressed={selected}
                            key={option.value}
                            onClick={() =>
                              question.kind === "multiple"
                                ? toggleMultiple(question.id, option.value)
                                : selectSingle(question.id, option.value)
                            }
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>
        </div>
      )}

      {isContactStep && (
        <div>
          <h3 className="fluent-assessment-title">A few details before your result</h3>
          <p className="fluent-assessment-intro">
            These details help me prepare if you decide to book a call. Your recommendation appears next.
          </p>
          <div className="fluent-contact-grid">
            <label>
              <span>Name</span>
              <input
                type="text"
                autoComplete="name"
                value={contact.name}
                onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))}
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={contact.email}
                onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))}
              />
            </label>
            <label>
              <span>Mobile</span>
              <input
                type="tel"
                autoComplete="tel"
                value={contact.mobile}
                onChange={(event) => setContact((current) => ({ ...current, mobile: event.target.value }))}
              />
            </label>
          </div>
        </div>
      )}

      <div className="fluent-assessment-actions">
        <button type="button" className="fluent-back" onClick={goBack} disabled={screenIndex === 0}>
          Back
        </button>
        {isContactStep ? (
          <button
            type="button"
            className="fluent-button"
            disabled={!canProceed || submitting}
            onClick={submit}
          >
            {submitting ? "Preparing your result..." : "See your result"}
          </button>
        ) : (
          <button type="button" className="fluent-button" disabled={!canProceed} onClick={goNext}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
