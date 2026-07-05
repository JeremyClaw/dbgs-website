import { Section } from "@/components/ui/Section";
import { copy } from "@/lib/copy";

export function Problem() {
  const { problem } = copy;

  return (
    <Section tone="cream">
      <div className="eyebrow mb-6">{problem.eyebrow}</div>
      <h2 className="display text-4xl md:text-6xl mb-14 max-w-3xl">
        {problem.headline.map((line, i) =>
          i === problem.headlineAccentIndex ? (
            <span key={i} style={{ color: "#c2410c" }}>
              {line}
              <br />
            </span>
          ) : (
            <span key={i}>{line} </span>
          )
        )}
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {problem.cards.map((card) => (
          <div className="problem-card" key={card.title}>
            <div className="thumb">
              <span />
            </div>
            <h3 className="font-bold mb-2">{card.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
