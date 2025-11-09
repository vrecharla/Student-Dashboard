// src/components/Topbar.tsx
import { useLocation } from "react-router-dom";

function titleFromPath(path: string) {
  if (path === "/") return "Dashboard";
  const map: Record<string,string> = {
    "/academic": "Academic",
    "/attendance": "Attendance",
    "/financial": "Financial",
    "/profile": "Profile",
    "/login": "Login",
  };
  return map[path] ?? "Dashboard";
}

export default function Topbar({ alerts = 0 }: { alerts?: number }) {
  const { pathname } = useLocation();
  const title = titleFromPath(pathname);

  return (
    <header className="h-16 border-b bg-white sticky top-0 z-40">
      <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
        <button className="relative" title="Notifications">
          <span role="img" aria-label="bell">🔔</span>
          {alerts > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] bg-rose-600 text-white rounded-full px-1.5">
              {alerts}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
