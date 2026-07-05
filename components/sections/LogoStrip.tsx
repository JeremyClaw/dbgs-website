import { copy } from "@/lib/copy";

function LogoChip({ name, url, logo }: { name: string; url: string; logo: string | null }) {
  return (
    <a href={url} target="_blank" rel="noopener" className="logo-chip">
      {logo ? (
        <img src={logo} alt={name} />
      ) : (
        <span className="wordmark-gloei">{name}</span>
      )}
    </a>
  );
}

export function LogoStrip() {
  const { logoStrip } = copy;
  const brands = [...logoStrip.brands, ...logoStrip.brands];

  return (
    <div className="border-y border-white/5 py-8 bg-[var(--dark-2)]">
      <div className="text-center text-[11px] uppercase tracking-widest text-gray-500 mb-6">
        {logoStrip.label}
      </div>
      <div className="marquee-container">
        <div className="marquee-content flex items-center gap-16 px-8">
          {brands.map((brand, i) => (
            <LogoChip key={`${brand.name}-${i}`} name={brand.name} url={brand.url} logo={brand.logo} />
          ))}
        </div>
      </div>
      <p className="text-center text-[10px] text-gray-600 mt-4">{logoStrip.caption}</p>
    </div>
  );
}
