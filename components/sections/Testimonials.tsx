import { copy } from "@/lib/copy";

export function Testimonials() {
  const { testimonials } = copy;

  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-24">
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.items.map((item) => (
          <a
            href={item.url}
            target="_blank"
            rel="noopener"
            key={item.brand}
            className="testimonial-card block hover:-translate-y-1 transition-transform"
          >
            <p className="text-sm leading-relaxed relative z-10 mb-5">{item.quote}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              {item.style === "script" && (
                <span className="font-script italic font-medium text-[var(--ink)] text-lg">
                  {item.brand}
                </span>
              )}
              {item.style === "sans" && (
                <span className="font-extrabold text-[var(--ink)]">{item.brand}</span>
              )}
              {item.style === "logo" && item.logo && (
                <img src={item.logo} alt={item.brand} className="h-6 w-auto" />
              )}
              <span className="placeholder-tag">Quote Pending</span>
            </div>
          </a>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500 mt-8">{testimonials.caption}</p>
    </section>
  );
}
