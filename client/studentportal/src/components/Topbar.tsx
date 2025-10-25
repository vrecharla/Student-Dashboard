export default function Topbar({ title = "Dashboard", alerts = 0 }: { title?: string; alerts?: number }) {
  return (
    <header className="h-14 border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-base font-semibold">{title}</h1>
        <button className="relative text-xl" title="Notifications" aria-label="Notifications">
          <span role="img" aria-label="bell">🔔</span>
          {alerts > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-600 text-white rounded-full px-1.5">
              {alerts}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
