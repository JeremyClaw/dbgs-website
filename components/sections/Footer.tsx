import { copy } from "@/lib/copy";

export function Footer() {
  const { footer } = copy;

  return (
    <footer className="bg-[var(--dark)] border-t border-white/5 py-12 px-5 md:px-8">
      <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-white font-extrabold">
          {footer.brand[0]} <span className="grad-text">{footer.brand[1]}</span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          {footer.email} · {footer.location}
        </div>
        <div className="text-[10px] text-gray-600">{footer.legal}</div>
      </div>
    </footer>
  );
}
