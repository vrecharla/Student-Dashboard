import UserProfile from "./UserProfile";
import Alerts from "./Alerts";
import { getStudent } from "../lib/auth";
import { Menu } from "lucide-react";

export default function Topbar({
  onMenuClick
}: {
  onMenuClick?: () => void;
  alerts?: any[];
}) {
  return (
    <header
      className="
        flex items-center justify-between 
        px-4 md:px-10 py-4
        gap-4
      "
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-black/10 shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Responsive Title — hidden on mobile */}
        <h1
          className="
            hidden md:block
            text-lg sm:text-lg md:text-xl font-extrabold 
            tracking-wide px-4 md:px-6 py-2 rounded-full shadow-lg 
            truncate
          "
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#fff",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          STUDENT DASHBOARD PORTAL
        </h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 shrink-0">
        <UserProfile
          name={getStudent()?.name}
          term={getStudent()?.admit_term ?? getStudent()?.term}
          avatar={getStudent()?.avatar}
        />

        <Alerts />

      </div>
    </header>
  );
}
