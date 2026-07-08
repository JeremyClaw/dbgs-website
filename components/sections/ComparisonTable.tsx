import { Section } from "@/components/ui/Section";
import { InlineCTA } from "@/components/ui/InlineCTA";
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

      {/* Mobile: compact side-by-side grid, tick/cross per column instead of a side-scrolling table */}
      <div className="md:hidden">
        <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-x-1 pb-3 mb-1 border-b border-gray-200">
          <div />
          {comparison.mobileColumns.map((col, i) => (
            <div
              key={col}
              className={`text-center text-[10px] uppercase tracking-wide font-bold ${
                i === 0 ? "text-[#1fb8a0]" : "text-gray-400"
              }`}
            >
              {col}
            </div>
          ))}
        </div>
        {comparison.mobileRows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-x-1 items-center py-3 border-b border-gray-100 last:border-0"
          >
            <div className="text-xs font-semibold text-[var(--ink)] pr-1 leading-tight">{row.label}</div>
            {row.verdicts.map((v, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-0.5 px-0.5">
                <span className={`text-sm leading-none ${v.pass ? "text-[#1fb8a0]" : "text-gray-300"}`}>
                  {v.pass ? "✓" : "✕"}
                </span>
                <span
                  className={`text-[10px] leading-tight ${
                    v.pass ? "text-[var(--ink)] font-semibold" : "text-gray-400"
                  }`}
                >
                  {v.text}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <InlineCTA text="Ready to stop doing it the hard way?" />
    </Section>
  );
}
