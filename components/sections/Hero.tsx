import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/copy";

export function Hero() {
  const { hero } = copy;

  return (
    <header className="max-w-[1180px] mx-auto px-5 md:px-8 pt-16 pb-20">
      <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1fb8a0]" />
        {hero.kicker}
      </div>

      <h1 className="display text-white text-4xl sm:text-5xl md:text-7xl mb-8">
        {hero.headline.map((line, i) => (
          <span key={i} className="md:block">
            {line}{" "}
          </span>
        ))}
        <span className="md:block">
          READY TO <span className="grad-text">{hero.headlineAccent}</span>
        </span>
      </h1>

      <p className="text-gray-400 text-lg max-w-xl mb-10 font-light">{hero.subhead}</p>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-10">
        {hero.checklist.map((item, i) => (
          <div className="check-item" key={i}>
            <span className="check-dot">✓</span>
            <span className="text-sm text-gray-300">{item}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Button href="#fit" variant="primary">
          {hero.ctaPrimary}
        </Button>
        <Button href="#approach" variant="secondary">
          {hero.ctaSecondary}
        </Button>
      </div>
      <p className="text-xs text-gray-500">{hero.riskReversal}</p>
    </header>
  );
}
