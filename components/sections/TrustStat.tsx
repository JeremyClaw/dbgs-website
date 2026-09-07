import { Section } from "@/components/ui/Section";
import { copy } from "@/lib/copy";

/**
 * Slim credibility band.
 *
 * This was a full two-column section headlined "WHY META ADS WORK", followed by
 * a second section of borrowed brand logos. Together they ran about two screens
 * arguing that Meta advertising is effective, to visitors who arrived on a paid
 * media page and had already accepted that. The cited stats are kept because
 * they are real and sourced; the argument around them is gone.
 */
export function TrustStat() {
  const { trustStat } = copy;

  return (
    <Section tone="dark-2">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:flex-1">
          {trustStat.stats.map((stat) => (
            <div key={stat.value} className="flex flex-col gap-1.5">
              <div className="display grad-text text-4xl sm:text-5xl leading-none">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 leading-snug max-w-[22ch]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:border-l lg:border-white/10 lg:pl-16">
          <div className="eyebrow mb-4" style={{ color: "#8a8f98" }}>
            {trustStat.eyebrow}
          </div>
          <div className="flex flex-wrap gap-3">
            {trustStat.platforms.map((platform) => (
              <span
                key={platform.name}
                className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5"
              >
                <img src={platform.logo} alt={platform.name} className="h-5 w-auto" />
                <span className="text-sm font-semibold text-[var(--ink)]">
                  {platform.name}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-8">{trustStat.citation}</p>
    </Section>
  );
}
