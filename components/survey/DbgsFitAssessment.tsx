"use client";

import { FitAssessment } from "./FitAssessment";
import { evaluate } from "./gate";
import { questions } from "./questions";

export function DbgsFitAssessment() {
  return <FitAssessment questions={questions} evaluate={evaluate} />;
}
