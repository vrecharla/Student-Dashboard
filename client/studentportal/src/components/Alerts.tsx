import { useState, useRef, useEffect, useMemo } from "react";
import { Bell } from "lucide-react";
import { getDashboard } from "../api/client";
import { getStudentId } from "../lib/auth";

export default function Alerts() {
  const [open, setOpen] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard data once
  useEffect(() => {
    const sId = getStudentId() || "S3001";
    getDashboard(sId, "Spring 2024")
      .then(setDashboard)
      .catch((err) => console.error(err));
  }, []);

  // Generate dynamic alerts
  const alerts = useMemo(() => {
    if (!dashboard) return [];

    const result: { id: string; text: string }[] = [];
    const now = new Date();
    const soonThreshold = 7; // days for "upcoming" alerts

    // 1. Upcoming assignments
    (dashboard.assignments ?? []).forEach((a: any) => {
      const due = new Date(a.due);
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= soonThreshold) {
        result.push({
          id: `assignment-${a.a_id}`,
          text: `Assignment "${a.a_name}" is due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
        });
      }
    });

    // 2. Low attendance
    (dashboard.attendance ?? []).forEach((a: any) => {
      if (a.attendance_pct < 75) {
        const course = dashboard.courses.find((c: any) => c.c_id === a.c_id);
        result.push({
          id: `attendance-${a.c_id}`,
          text: `Below required attendance (${a.attendance_pct}%) in ${course?.c_title || a.c_id}`,
        });
      }
      else if (a.attendance_pct < 80) {
        const course = dashboard.courses.find((c: any) => c.c_id === a.c_id);
        result.push({
          id: `attendance-warning-${a.c_id}`,
          text: `Attendance approaching risk threshold (${a.attendance_pct}%) in ${course?.c_title || a.c_id}`,
        });
      }
    });

    // 3. Finance alerts
    if (dashboard.financeSummary?.balance_due > 0) {
      result.push({
        id: "finance-due",
        text: `Fees balance overdue: $${dashboard.financeSummary.balance_due.toFixed(2)}`,
      });
    } else if (dashboard.financeSummary?.next_due_date) {
      const dueDate = new Date(dashboard.financeSummary.next_due_date);
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= soonThreshold) {
        result.push({
          id: "finance-upcoming",
          text: `Next fees due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
        });
      }
    }

    // 4. Low GPA alert
    if (dashboard.metrics?.gpa < 2.0) {
      result.push({
        id: "low-gpa",
        text: `Your GPA is low (${dashboard.metrics.gpa.toFixed(2)})`,
      });
    }

    return result;
  }, [dashboard]);

  // CLICK OUTSIDE HANDLER
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative p-2 rounded-xl hover:bg-black/10 transition"
      >
        <Bell className="w-6 h-6 text-[var(--color-primary)]" />
        {alerts.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 z-50 bg-white rounded-2xl shadow-xl border border-[var(--color-border)] animate-fade-slide">
          <div className="px-4 py-3 rounded-t-2xl text-white font-semibold text-sm" style={{ backgroundColor: "var(--color-primary)" }}>
            Alerts
          </div>
          <div className="p-3 max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">You're all caught up 🎉</p>
            ) : (
              <ul className="space-y-2">
                {alerts.map((a) => (
                  <li key={a.id} className="p-3 rounded-xl text-sm cursor-pointer border border-gray-200 transition" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.06)" }}>
                    <p className="text-gray-800">{a.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
