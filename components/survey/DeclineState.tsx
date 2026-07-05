"use client";

import { useState } from "react";
import type { ContactDetails } from "./questions";
import { copy } from "@/lib/copy";

export function DeclineState({ contact }: { contact: ContactDetails }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-[560px] mx-auto bg-white text-[var(--ink)] rounded-2xl overflow-hidden shadow-2xl p-8 text-center">
      <h3 className="display text-3xl mb-3">{copy.decline.headline}</h3>
      <p className="text-gray-600 mb-6">{copy.decline.body}</p>

      {submitted ? (
        <p className="text-sm text-[#1fb8a0] font-semibold">{copy.decline.submitted}</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{copy.decline.offer}</p>
          <p className="text-sm text-gray-400">
            We already have your email from the assessment ({contact.email}). No further action needed,
            we will reach out if the timing lines up.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="grad-btn text-white text-xs font-bold px-7 py-3.5 rounded-full mt-6"
          >
            {copy.decline.submit}
          </button>
        </>
      )}
    </div>
  );
}
