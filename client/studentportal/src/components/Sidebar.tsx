import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Wallet,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clearAuth } from "../lib/auth";

const linkBase =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer";

const active = "text-[var(--primary)] font-semibold bg-white/15";
const idle = "text-white/90 hover:bg-[var(--border)] hover:text-[var(--primary)]";

export default function Sidebar({
  collapsed,
  onToggle,
  onItemSelect,
}: {
  collapsed: boolean;
  onToggle: (next: boolean) => void;
  onItemSelect: () => void;
}) {
  const navigate = useNavigate();

  // Generic sidebar item: either NavLink or button
  const Item = ({
    to,
    icon: Icon,
    label,
    onClick,
  }: {
    to?: string;
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
  }) => {
    if (to) {
      // Normal navigation link
      return (
        <NavLink
          to={to}
          end
          onClick={() => {
            onItemSelect();
            onClick?.();
          }}
          className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
          title={collapsed ? label : undefined}
        >
          <Icon className={`w-5 h-5 ${window.location.pathname === to ? "text-[var(--primary)]" : ""}`} />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      );
    }

    // Button (for logout)
    return (
      <button
        onClick={() => {
          onItemSelect();
          onClick?.();
        }}
        className={`${linkBase} text-left w-full bg-transparent border-none hover:bg-[var(--border)] hover:text-[var(--primary)]`}
        title={collapsed ? label : undefined}
      >
        <Icon className="w-5 h-5" />
        {!collapsed && <span>{label}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`h-full flex flex-col rounded-r-xl text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{ backgroundColor: "var(--color-primary)", boxShadow: "var(--shadow-soft)" }}
    >
      {/* Top logo + collapse toggle */}
      <div className={`pt-4 p-2 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        {!collapsed && (
          <div
            className="w-10 h-10 rounded-xl grid place-items-center font-bold text-white"
            style={{ backgroundColor: "var(--color-success)" }}
          >
            HSU
          </div>
        )}

        {!collapsed && <p className="text-sm font-semibold">Horizon State University</p>}

        <button
          onClick={() => onToggle(!collapsed)}
          className={`p-2 rounded-md text-white hover:bg-white/10 ${collapsed ? "mx-auto" : "ml-auto"}`}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="px-2 py-6 space-y-4 flex-1">
        <Item to="/" icon={LayoutDashboard} label="Dashboard" />
        <Item to="/academic" icon={BookOpen} label="Academic" />
        <Item to="/attendance" icon={CalendarDays} label="Attendance" />
        <Item to="/financial" icon={Wallet} label="Financial" />
        <Item to="/profile" icon={User} label="Profile" />
      </nav>

      {/* Logout button at the bottom */}
      <div className="p-2 mt-auto border-t border-white/10">
        <Item
          icon={LogOut}
          label="Logout"
          onClick={() => {
            clearAuth();
            navigate("/login", { replace: true });
          }}
        />
      </div>
    </aside>
  );
}
