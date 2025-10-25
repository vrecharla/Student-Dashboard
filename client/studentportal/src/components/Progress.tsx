export default function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-600" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}
