// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Wallet,
  User,
  LogOut,
} from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-200";
const active = "bg-white text-[var(--primary)] font-semibold";
const idle = "text-white/90 hover:bg-[var(--border)]";

const Item = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside
      className="w-64 shrink-0 h-screen flex flex-col text-white rounded-r-2xl shadow-lg"
      style={{
        backgroundColor: "var(--color-primary)",
        boxShadow:  "var(--shadow-soft)",
        ["--primary" as any]: "var(--color-primary)",
        ["--border" as any]: "var(--color-border)",
      }}
    >
      <div className="pt-10 p-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl grid place-items-center font-bold text-white"
          style={{ backgroundColor: "var(--color-success)" }}
        >
          HSU
        </div>
        <div>
          <p className="text-sm font-semibold">Horizon State University</p>
        </div>
      </div>

      <nav className="px-3 py-10 space-y-4 flex-1">
        <Item to="/" icon={LayoutDashboard} label="Dashboard" />
        <Item to="/academic" icon={BookOpen} label="Academic" />
        <Item to="/attendance" icon={CalendarDays} label="Attendance" />
        <Item to="/financial" icon={Wallet} label="Financial" />
        <Item to="/profile" icon={User} label="Profile" />
      </nav>

      <div className="p-3 mt-auto border-t border-white/10">
        <Item to="/login" icon={LogOut} label="Logout" />
      </div>
    </aside>
  );
}
