export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-slate-900">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

export function SkillRow({
  skills,
}: {
  skills: Array<{ label: string; level: string | null }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {skills.map((s) => (
        <div
          key={s.label}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
        >
          <span className="text-sm text-slate-600">{s.label}</span>
          <span className="text-sm font-bold text-brand">
            {s.level ?? "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
