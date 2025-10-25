export function Stat({ value, sub }: { value: string; sub?: string }) {
  return (
    <div>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
