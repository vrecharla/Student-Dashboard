// src/components/Topbar.tsx
import UserProfile from "./UserProfile";
import { getStudent } from "../lib/auth";

export default function Topbar() {
  return (
    <header
      className="flex items-center justify-between px-10 py-4 pr-15"
    >
      {/* Left: Title */}
      <h1
        className="text-2xl font-extrabold tracking-wide px-30 py-2 rounded-full shadow-lg"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "#fff",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        STUDENT DASHBOARD PORTAL
      </h1>

      {/* Right: Profile */}
      <UserProfile
        name={getStudent()?.name}
        role={getStudent()?.role}
        avatar={getStudent()?.avatar}
      />
    </header>
  );
}
