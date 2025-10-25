import { NavLink } from "react-router-dom";

const item =
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2 ring-indigo-600";
const active = "bg-indigo-50 text-indigo-700 font-medium";
const idle = "text-slate-700 hover:bg-slate-50";

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-slate-200 bg-white">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">
          HSU
        </div>
        <div>
          <p className="text-sm font-semibold">Student Portal</p>
          <p className="text-xs text-slate-500">Horizon State Univ.</p>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        <NavLink to="/" end className={({ isActive }) => `${item} ${isActive ? active : idle}`}>
          <span>🏠</span> <span>Home / Dashboard</span>
        </NavLink>

        {/* placeholders requested to stay empty for now */}
        <NavLink to="/finance" className={({ isActive }) => `${item} ${isActive ? active : idle}`}>
          <span>💰</span> <span>Finance</span>
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => `${item} ${isActive ? active : idle}`}>
          <span>🗓️</span> <span>Attendance</span>
        </NavLink>
        <NavLink to="/assignments" className={({ isActive }) => `${item} ${isActive ? active : idle}`}>
          <span>📝</span> <span>Assignments</span>
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `${item} ${isActive ? active : idle}`}>
          <span>🔔</span> <span>Notifications</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `${item} ${isActive ? active : idle}`}>
          <span>👤</span> <span>Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}
