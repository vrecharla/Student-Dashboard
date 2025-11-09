// src/components/MiniCalendar.tsx
const dayNames = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function monthMatrix(d: Date) {
  const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - first.getDay());
  const weeks: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const c = new Date(start); c.setDate(start.getDate() + i); weeks.push(c);
  }
  return weeks;
}

export default function MiniCalendar() {
  const today = new Date();
  const title = today.toLocaleString(undefined, { month: "long", year: "numeric" });
  const days = monthMatrix(today);
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] p-5">
      <div className="text-xs inline-flex px-3 py-1 rounded-md bg-purple-50 text-purple-800 font-semibold mb-3">
        {title}
      </div>
      <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-500">
        {dayNames.map((d) => <div key={d} className="text-center font-medium">{d}</div>)}
        {days.map((d, i) => {
          const inMonth = d.getMonth() === today.getMonth();
          const isToday = isSameDay(d, today);
          return (
            <div
              key={i}
              className={[
                "h-8 grid place-items-center rounded-md",
                inMonth ? "text-slate-700" : "text-slate-300",
                isToday ? "bg-purple-600 text-white font-semibold" : "hover:bg-slate-100"
              ].join(" ")}
              title={d.toDateString()}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
