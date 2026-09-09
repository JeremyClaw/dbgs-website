"use client";

import { FluentAssessment } from "./FluentAssessment";
import { evaluate } from "./gate-ai";
import { questionScreens } from "./questions-ai";

export function FluentFitAssessment() {
  return <FluentAssessment screens={questionScreens} evaluate={evaluate} />;
}
