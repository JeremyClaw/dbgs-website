import { StatCard } from "@/components/ui/StatCard";
import { copy } from "@/lib/copy";

export function Services() {
  return (
    <section className="bg-white text-[var(--ink)] pb-24 px-5 md:px-8">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {copy.services.map((service) => (
          <StatCard
            key={service.index}
            index={service.index}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
}
