import { NavLink } from "react-router-dom";

const linkBase = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm";
const active   = "bg-indigo-100 text-indigo-700 font-medium";
const idle     = "text-gray-700 hover:bg-gray-100";

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-full border-r bg-white">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">HSU</div>
        <div>
          <p className="text-sm font-semibold">Student Portal</p>
          <p className="text-xs text-gray-500">Horizon State Univ.</p>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        <NavLink
          to="/"
          end
          className={({isActive}) => `${linkBase} ${isActive ? active : idle}`}
        >
          <span>🏠</span> <span>Home / Dashboard</span>
        </NavLink>

        {/* placeholders for later sections */}
        <div className={`${linkBase} text-gray-400 cursor-not-allowed`}>
          <span>💰</span> <span>Finance (soon)</span>
        </div>
        <div className={`${linkBase} text-gray-400 cursor-not-allowed`}>
          <span>🗓️</span> <span>Attendance (soon)</span>
        </div>
        <div className={`${linkBase} text-gray-400 cursor-not-allowed`}>
          <span>📝</span> <span>Assignments (soon)</span>
        </div>
      </nav>
    </aside>
  );
}
