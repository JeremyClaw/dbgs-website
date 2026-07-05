import { Section } from "@/components/ui/Section";
import { copy } from "@/lib/copy";

export function Process() {
  const { process } = copy;

  return (
    <Section tone="dark">
      <div className="eyebrow mb-6" style={{ color: "#8a8f98" }}>
        {process.eyebrow}
      </div>
      <h2 className="display text-white text-4xl md:text-5xl mb-14">{process.headline}</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {process.steps.map((step) => (
          <div key={step.index}>
            <div className="display text-5xl grad-text mb-4">{step.index}</div>
            <h4 className="text-white font-bold mb-2">{step.title}</h4>
            <p className="text-sm text-gray-400">{step.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
