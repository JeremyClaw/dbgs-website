"use client";

import { useEffect, useRef, useState } from "react";
import { BookingReveal } from "./BookingReveal";
import type { FluentResult } from "./gate-ai";
import type {
  FluentAnswers,
  FluentQuestion,
  FluentQuestionScreen,
} from "./questions-ai";

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
  const [result, setResult] = useState<FluentResult | null>(null);

  const screen = screens[screenIndex];
  const progress = Math.round(((screenIndex + 1) / screens.length) * 100);
  const canProceed = screen.questions.every((question) => hasAnswer(question, answers));

  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const assessmentPanel = flowTopRef.current?.closest(".fluent-assessment-section");
      if (assessmentPanel instanceof HTMLElement) {
        assessmentPanel.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      } else {
        flowTopRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
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
    if (!canProceed) return;
    if (screenIndex === screens.length - 1) {
      setResult(evaluate(answers));
      return;
    }
    setScreenIndex((current) => current + 1);
  }

  if (result) {
    return (
      <div ref={flowTopRef} className="fluent-assessment-flow-top">
        <BookingReveal
          funnel="fluent"
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
          <span>{`Section ${screenIndex + 1} of ${screens.length}`}</span>
          <span>{progress}%</span>
        </div>
        <div className="fluent-progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

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

      <div className="fluent-assessment-actions">
        <button type="button" className="fluent-back" onClick={goBack} disabled={screenIndex === 0}>
          Back
        </button>
        <button type="button" className="fluent-button" disabled={!canProceed} onClick={goNext}>
          {screenIndex === screens.length - 1 ? "See your recommendation" : "Continue"}
        </button>
      </div>
    </div>
  );
}
