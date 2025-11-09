// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

const linkBase = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm";
const active   = "bg-purple-50 text-purple-700 font-medium";
const idle     = "text-slate-700 hover:bg-slate-100";

const Item = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
  <NavLink to={to} end className={({isActive}) => `${linkBase} ${isActive ? active : idle}`}>
    <span aria-hidden>{icon}</span> <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-full border-r bg-white">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white grid place-items-center font-bold">HSU</div>
        <div>
          <p className="text-sm font-semibold">Student Portal</p>
          <p className="text-xs text-slate-500">Horizon State Univ.</p>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        <Item to="/"           icon="🏠" label="Home / Dashboard" />
        <Item to="/academic"   icon="📚" label="Academic" />
        <Item to="/attendance" icon="🗓️" label="Attendance" />
        <Item to="/financial"  icon="💰" label="Financial" />
        <Item to="/profile"    icon="👤" label="Profile" />
        <Item to="/login"      icon="🚪" label="Logout" />
      </nav>
    </aside>
  );
}
