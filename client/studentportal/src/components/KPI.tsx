// src/components/KPI.tsx
export default function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <div className="mt-1 h-1 w-16 rounded-full bg-purple-600" />
      <p className="mt-3 text-4xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
