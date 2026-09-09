import { Section } from "@/components/ui/Section";
import { DbgsFitAssessment } from "@/components/survey/DbgsFitAssessment";
import { copy } from "@/lib/copy";

export function CTA() {
  const { cta } = copy;

  return (
    <Section tone="dark-2" id="fit">
      <div className="max-w-[560px] mx-auto text-center mb-10">
        <div className="eyebrow justify-center mb-6" style={{ color: "#8a8f98" }}>
          {cta.eyebrow}
        </div>
        <h2 className="display text-white text-4xl md:text-5xl mb-5">
          {cta.headline} <span className="grad-text">{cta.headlineAccent}</span>
        </h2>
        <p className="text-gray-400 text-sm">{cta.subhead}</p>
      </div>

      <DbgsFitAssessment />

      {/* Low-commitment path. See the note on cta.fallbackLabel in lib/copy.ts
          for why this is an email and not a booking link. */}
      <div className="max-w-[560px] mx-auto mt-10 pt-8 border-t border-white/10 text-center">
        <p className="text-sm text-gray-400">
          {cta.fallbackLabel}{" "}
          <span className="text-gray-500">{cta.fallbackBody}</span>
        </p>
        {/* py-3 keeps this above the 44px touch-target floor. As a bare inline
            link it rendered 20px high, which is a miss on a phone. */}
        <a
          href={`mailto:${copy.footer.email}?subject=DBGS%20enquiry`}
          className="inline-flex items-center justify-center mt-2 px-4 py-3 text-sm font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors"
        >
          {copy.footer.email}
        </a>
      </div>
    </Section>
  );
}
