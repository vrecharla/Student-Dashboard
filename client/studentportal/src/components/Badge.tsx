export function Badge({ children, tone = "slate" }: { children: string; tone?: "slate"|"green"|"amber"|"red" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  return <span className={`text-xs px-2 py-1 rounded-full ${map[tone]}`}>{children}</span>;
}
