import { Section } from "@/components/ui/Section";
import { copy } from "@/lib/copy";

export function FounderCredibility() {
  const { founder } = copy;

  return (
    <Section tone="dark">
      <div className="grid lg:grid-cols-[auto_1fr] gap-10 items-start">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#1fb8a0] to-[#2563eb] flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            {founder.photo ? (
              <img src={founder.photo} alt={founder.name} className="w-full h-full object-cover" />
            ) : (
              "DB"
            )}
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-sm">{founder.name}</div>
            <div className="text-gray-500 text-xs">{founder.title}</div>
          </div>
        </div>
        <div>
          <div className="eyebrow mb-4" style={{ color: "#8a8f98" }}>
            {founder.eyebrow}
          </div>
          <h2 className="display text-white text-3xl md:text-4xl mb-6">
            {founder.headline} {founder.headlineLine2}
            <br />
            <span className="grad-text">{founder.headlineAccent}</span>
          </h2>
          <div className="space-y-4 max-w-2xl">
            {founder.body.map((paragraph, i) => (
              <p key={i} className="text-gray-400 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
