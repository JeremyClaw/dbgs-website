import { ReactNode } from "react";

type Tone = "dark" | "dark-2" | "cream" | "white";

const toneClass: Record<Tone, string> = {
  dark: "bg-[var(--dark)]",
  "dark-2": "bg-[var(--dark-2)]",
  cream: "section-cream",
  white: "bg-white text-[var(--ink)]",
};

export function Section({
  id,
  tone = "dark",
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${toneClass[tone]} py-24 px-5 md:px-8 ${className}`}>
      <div className="max-w-[1180px] mx-auto">{children}</div>
    </section>
  );
}
