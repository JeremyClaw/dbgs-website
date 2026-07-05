export function StatCard({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:border-[#1fb8a0]/50 transition-colors bg-white">
      <div className="text-xs font-mono text-gray-400 mb-3">{index}</div>
      <h3 className="font-bold mb-2 text-[var(--ink)]">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
