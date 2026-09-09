import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | AI, made clear",
  description: "How AI, made clear collects and uses personal information.",
  alternates: { canonical: "/AI-coaching-by-deej/privacy" },
};

export default function CoachingPrivacyPage() {
  return (
    <main className="fluent fluent-privacy-page">
      <div className="fluent-shell">
        <a className="fluent-wordmark" href="/AI-coaching-by-deej">
          <strong>AI, made clear</strong>
          <span>Back to coaching</span>
        </a>
        <h1>Privacy</h1>
        <p>
          We collect the answers you give in the assessment, plus your name, email address,
          mobile number, meeting choice and chosen time when you book.
        </p>
        <p>
          We use this information only to arrange and run your coaching. We do not sell or
          share it. Your details are kept only for as long as they are needed for coaching,
          booking records and legal record keeping.
        </p>
        <p>
          You may ask to see, correct or delete your personal information by emailing
          {" "}<a href="mailto:deej@deejburke.co.za">deej@deejburke.co.za</a>.
        </p>
        <p>
          We handle personal information in line with South Africa&apos;s Protection of Personal
          Information Act, commonly called POPIA.
        </p>
      </div>
    </main>
  );
}
