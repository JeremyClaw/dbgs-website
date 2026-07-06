import { Section } from "@/components/ui/Section";
import { copy } from "@/lib/copy";

export function ComparisonTable() {
  const { comparison } = copy;

  return (
    <Section tone="white">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="display text-4xl md:text-5xl mb-2">
          {comparison.headline.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
          <span className="block grad-text">{comparison.headlineAccent}</span>
        </h2>
      </div>

      {/* Tablet and up: full side-by-side table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="text-left py-4 px-4 text-xs uppercase tracking-widest text-gray-400 font-semibold w-1/4">
                &nbsp;
              </th>
              {comparison.columns.map((col, i) => (
                <th
                  key={col}
                  className={`text-center py-4 px-4 text-sm font-bold ${
                    i === 0
                      ? "bg-[var(--cream)] rounded-t-xl text-[var(--ink)]"
                      : "text-gray-500"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="py-4 px-4 text-sm font-semibold text-[var(--ink)]">{row.label}</td>
                {row.values.map((value, i) => (
                  <td
                    key={i}
                    className={`text-center py-4 px-4 text-sm ${
                      i === 0
                        ? "bg-[var(--cream)] font-semibold text-[var(--ink)]"
                        : "text-gray-500"
                    }`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="py-2 px-4" />
              {comparison.columns.map((col, i) => (
                <td
                  key={col}
                  className={`py-2 px-4 ${i === 0 ? "bg-[var(--cream)] rounded-b-xl" : ""}`}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: one stacked card per row instead of side-scrolling a table */}
      <div className="md:hidden space-y-4">
        {comparison.rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-[var(--ink)]">
              {row.label}
            </div>
            <div className="divide-y divide-gray-100">
              {row.values.map((value, i) => (
                <div
                  key={i}
                  className={`flex items-baseline justify-between gap-4 px-4 py-3 text-sm ${
                    i === 0 ? "bg-[var(--cream)] font-semibold text-[var(--ink)]" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`text-xs uppercase tracking-widest shrink-0 ${
                      i === 0 ? "text-[var(--ink)]/70" : "text-gray-400"
                    }`}
                  >
                    {comparison.columns[i]}
                  </span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
