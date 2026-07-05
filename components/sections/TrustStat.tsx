import { Section } from "@/components/ui/Section";
import { copy } from "@/lib/copy";

export function TrustStat() {
  const { trustStat } = copy;

  return (
    <Section tone="dark-2">
      <div className="eyebrow mb-6" style={{ color: "#8a8f98" }}>
        {trustStat.eyebrow}
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="display text-white text-4xl md:text-5xl mb-6">
            {trustStat.headline.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
            <span className="block grad-text">{trustStat.headlineAccent}</span>
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-xl">{trustStat.body}</p>
          <p className="text-[11px] text-gray-600 mt-4">{trustStat.citation}</p>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {trustStat.stats.map((stat) => (
              <div key={stat.value} className="border border-white/10 rounded-xl p-6 bg-black/20">
                <div className="display text-4xl md:text-5xl grad-text mb-2">{stat.value}</div>
                <div className="text-xs text-gray-400 leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-5">
            <div className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">
              {trustStat.platformsLabel}
            </div>
            <div className="flex flex-wrap gap-3">
              {trustStat.platforms.map((platform) => (
                <span
                  key={platform.name}
                  className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5"
                >
                  <img src={platform.logo} alt={platform.name} className="h-5 w-auto" />
                  <span className="text-sm font-semibold text-[var(--ink)]">{platform.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
