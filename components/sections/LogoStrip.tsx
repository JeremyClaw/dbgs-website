import { copy } from "@/lib/copy";

function LogoTile({ name, url, logo }: { name: string; url: string; logo: string | null }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      className="flex items-center justify-center h-20 w-36 sm:w-40 rounded-xl bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {logo ? (
        <img src={logo} alt={name} className="max-h-10 max-w-[75%] object-contain" />
      ) : (
        <span className="wordmark-gloei">{name}</span>
      )}
    </a>
  );
}

export function LogoStrip() {
  const { logoStrip } = copy;

  return (
    <div className="border-y border-white/5 py-14 bg-[var(--dark-2)]">
      <div className="text-center text-[11px] uppercase tracking-widest text-gray-500 mb-8">
        {logoStrip.label}
      </div>
      <div className="max-w-[1000px] mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-5 px-5">
        {logoStrip.brands.map((brand) => (
          <LogoTile key={brand.name} name={brand.name} url={brand.url} logo={brand.logo} />
        ))}
      </div>
    </div>
  );
}
