import { Section } from "@/components/ui/Section";
import { FitAssessment } from "@/components/survey/FitAssessment";
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

      <FitAssessment />
    </Section>
  );
}
