import { Hero } from "@/components/sections/Hero";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { TrustStat } from "@/components/sections/TrustStat";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { FounderCredibility } from "@/components/sections/FounderCredibility";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { copy } from "@/lib/copy";

export default function Home() {
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[var(--dark)]/90 backdrop-blur-md">
        <div className="flex max-w-[1180px] mx-auto px-5 md:px-8 py-4 items-center justify-between gap-3">
          <div className="text-white font-extrabold tracking-tight text-sm sm:text-lg whitespace-nowrap">
            {copy.nav.brand[0]} <span className="grad-text">{copy.nav.brand[1]}</span>
          </div>
          <a
            href="#fit"
            className="grad-btn text-white text-xs sm:text-sm font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-full transition-all whitespace-nowrap flex-shrink-0"
          >
            {copy.nav.cta}
          </a>
        </div>
      </nav>

      <Hero />
      <LogoStrip />
      <Problem />
      <TrustStat />
      {/* ProvenBrands (Gymshark, SKIMS, MVMT, Fashion Nova) unmounted Sep 2026.
          Borrowed logos sat two sections from our own client strip and invited a
          comparison we lose. Component and copy are still in the repo if we want
          to reinstate it somewhere it does not compete with our own proof. */}
      <Solution />
      <FounderCredibility />
      <Services />
      <Process />
      <ComparisonTable />
      <CTA />
      <Footer />
    </>
  );
}
