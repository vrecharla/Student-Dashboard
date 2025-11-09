export function Badge(
  { tone = "gray", children }: { tone?: "green" | "amber" | "red" | "gray"; children: React.ReactNode }
) {
  const tones: Record<string, string> = {
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-rose-100 text-rose-800",
    gray: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone] || tones.gray}`}>
      {children}
    </span>
  );
}
