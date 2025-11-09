export default function Progress({ value }: { value: number }) {
  return (
    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          backgroundColor: "var(--color-primary)",
        }}
      />
    </div>
  );
}
