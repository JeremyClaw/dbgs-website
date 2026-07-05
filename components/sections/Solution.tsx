import { Section } from "@/components/ui/Section";
import { copy } from "@/lib/copy";

export function Solution() {
  const { solution } = copy;

  return (
    <Section tone="white" id="approach">
      <div className="max-w-[900px] mx-auto text-center">
        <div className="eyebrow justify-center mb-6">{solution.eyebrow}</div>
        <h2 className="display text-4xl md:text-6xl mb-8">
          {solution.headline}
          <br />
          {solution.headlineLine2} <span className="grad-text">{solution.headlineAccent}</span>
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">{solution.body}</p>
      </div>
    </Section>
  );
}
