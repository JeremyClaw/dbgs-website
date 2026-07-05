import { Section } from "@/components/ui/Section";
import { copy } from "@/lib/copy";

function BrandTile({
  name,
  logo,
  style,
}: {
  name: string;
  logo?: string;
  style?: "text-bold" | "text-split";
}) {
  return (
    <div className="flex items-center justify-center h-28 sm:h-32 w-full rounded-2xl bg-white px-3 overflow-hidden">
      {logo && <img src={logo} alt={name} className="max-h-10 sm:max-h-12 max-w-full object-contain" />}
      {style === "text-bold" && (
        <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--ink)] whitespace-nowrap">
          {name}
        </span>
      )}
      {style === "text-split" && (
        <span className="text-base sm:text-xl font-bold tracking-tight text-[var(--ink)] whitespace-nowrap">
          <span className="font-light">FASHION</span>
          <span className="font-black">NOVA</span>
        </span>
      )}
    </div>
  );
}

export function ProvenBrands() {
  const { provenBrands } = copy;

  return (
    <Section tone="dark">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="eyebrow justify-center mb-6" style={{ color: "#8a8f98" }}>
          {provenBrands.eyebrow}
        </div>
        <h2 className="display text-4xl md:text-6xl mb-6">
          {provenBrands.headline.map((line, i) => (
            <span key={i} className="block text-white">
              {line}
            </span>
          ))}
          <span className="block grad-text">{provenBrands.headlineAccent}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
        {provenBrands.brands.map((brand) => (
          <BrandTile key={brand.name} name={brand.name} logo={brand.logo} style={brand.style as "text-bold" | "text-split" | undefined} />
        ))}
      </div>
    </Section>
  );
}
