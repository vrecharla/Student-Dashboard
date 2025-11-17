import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import { getStudentId } from "../lib/auth";
import Progress from "../components/Progress";
import PageLoader from "../components/PageLoader";

// --- CalendarCard component ---
function CalendarCard({
  current,
  onChange,
  deadlinesByDate,
}: {
  current: Date;
  onChange: (d: Date) => void;
  deadlinesByDate: Map<string, any[]>;
}) {
  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(current.getFullYear(), current.getMonth(), 1)
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++)
    days.push(new Date(year, month, i));

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[var(--color-primary)]">
          {viewMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="px-2 hover:bg-gray-100 rounded">◀</button>
          <button onClick={nextMonth} className="px-2 hover:bg-gray-100 rounded">▶</button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-sm">
        {days.map((d, i) => {
          if (!d) return <div key={i} className="h-8"></div>;
          const key = d.toDateString();
          const hasDeadline = deadlinesByDate.has(key);
          const isToday = d.toDateString() === new Date().toDateString();
          const isSelected = d.toDateString() === current.toDateString();
          return (
            <button
              key={i}
              onClick={() => onChange(d)}
              className={`h-8 rounded flex items-center justify-center relative
              ${isSelected ? "bg-[var(--color-primary)] text-white" : "hover:bg-gray-100"}
              ${isToday ? "ring-1 ring-[var(--color-border)]" : ""}`}
            >
              {d.getDate()}
              {hasDeadline && (
                <span className="absolute -top-1 right-1 w-1.5 h-1.5 bg-[var(--color-danger)] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const sId = getStudentId() || "S3001";
    getDashboard(sId, "Spring 2024")
      .then(setData)
      .catch((e) => {
        // Remove demo fallback; surface error so UI can show a message
        setErr(String(e ?? "Failed to load dashboard"));
      });
  }, []);

  if (err) return <div className="p-6 text-red-600">Could not load dashboard: {err}</div>;
  if (!data) return <PageLoader />;

  const { metrics, student } = data;

  // Build calendar items from assignment due dates only (server no longer returns a separate `deadlines` field)
  const deadlinesByDate = new Map<string, any[]>();
  const normalizedDeadlines: any[] = [];

  // include assignment due dates as calendar deadlines
  (data.assignments ?? []).forEach((a: any) => {
    const dueRaw = a.due ?? a.due_date ?? a.dueDate ?? null;
    const due = dueRaw ? new Date(dueRaw) : null;
    // find course code for label/context
    const course = data.courses?.find((c) => c.c_id === a.c_id);
    normalizedDeadlines.push({
      course_code: course?.c_id,
      label: a.a_name ?? a.a_id,
      due,
      _source: "assignment",
      a_id: a.a_id,
    });
  });

  // build map for calendar highlighting and selected date lists
  normalizedDeadlines.forEach((d) => {
    if (!d.due) return;
    const key = d.due.toDateString();
    if (!deadlinesByDate.has(key)) deadlinesByDate.set(key, []);
    deadlinesByDate.get(key)!.push(d);
  });
  const selectedDeadlines = deadlinesByDate.get(selectedDate.toDateString()) || [];

  // Prepare upcoming deadlines (sorted ascending) and limit to next 5
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const upcomingDeadlines = normalizedDeadlines
    .filter((d) => d.due != null && d.due!.getTime() >= todayStart.getTime())
    .sort((a, b) => (a.due!.getTime() - b.due!.getTime()))
    .slice(0, 5);

  return (
    <div className="space-y-10 px-6">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white p-6 rounded-2xl shadow-lg" style={{ boxShadow: "var(--shadow-soft)" }}>
        <p className="opacity-80 text-xs mb-2 pb-6">
          {new Date().toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h2 className="text-2xl font-bold">Welcome back, {student.name.split(" ")[0]}!</h2>
        <p className="opacity-90 text-sm">Stay updated in your student portal</p>
      </div>

      {/* 3-column main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2/3 AREA */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI metrics */}
          {/* KPI metrics */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {/* GPA */}
  <div className="bg-white p-5 rounded-xl shadow-md"
      style={{
        boxShadow: "var(--shadow-soft)",
      }}>
    <div className="text-md text-gray-600 font-medium mb-2 border-b-4 border-[var(--color-primary)] inline-block">
      GPA
    </div>
    <p className="text-3xl font-bold mt-2">{metrics.gpa.toFixed(2)}</p>
  </div>

  {/* Attendance with progress bar */}
  <div className="bg-white p-5 rounded-xl shadow-md pt - 7"
      style={{
        boxShadow: "var(--shadow-soft)",
      }}>
    <div className="flex justify-between items-center mb-2 pb-5">
      <span className="text-md text-gray-600 font-medium border-b-4 border-[var(--color-primary)]">
        Attendance
      </span>
      <span className="text-sm font-semibold text-gray-800">
        {Math.round(metrics.attendance_pct * 100)}%
      </span>
    </div>
    <Progress
      value={metrics.attendance_pct}
    />
  </div>

  {/* Balance */}
  <div className="bg-white p-5 rounded-xl shadow-md"
      style={{
        boxShadow: "var(--shadow-soft)",
      }}>
    <div className="text-md text-gray-600 font-medium mb-2 border-b-4 border-[var(--color-primary)] inline-block">
      Balance
    </div>
    <p className="text-3xl font-bold mt-2">
      ${Math.max(0, data.financeSummary.balance_due).toFixed(0)}
    </p>
  </div>
</div>


          {/* Courses + Attendance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enrolled Courses */}
            <div className="bg-white shadow-md rounded-xl p-4" 
                style={{
                  boxShadow: "var(--shadow-soft)",
                }}>
              <h3 className="font-semibold text-[var(--color-primary)] mb-3">Enrolled Courses</h3>

              <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="px-2 py-2 whitespace-nowrap">Course Name</th>
                    <th className="px-2 py-2 whitespace-nowrap">Code</th>
                    <th className="px-2 py-2 whitespace-nowrap">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {data.courses.map((c, i) => (
                    <tr key={c.c_id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="px-2 py-2 whitespace-nowrap">{c.c_title}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{c.c_id}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{c.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white shadow-md rounded-xl p-4"
              style={{
                  boxShadow: "var(--shadow-soft)",
                }}>
              <h3 className="font-semibold text-[var(--color-primary)] mb-3">Attendance</h3>
              <div className="space-y-4">
                {data.attendance.map((a) => {
                  const c = data.courses.find((x) => x.c_id === a.c_id);
                  return (
                    <div key={a.c_id}>
                      <div className="flex justify-between mb-1">
                        <p>{c?.c_title}</p>
                        <p>{a.attendance_pct}%</p>
                      </div>
                      <Progress value={a.attendance_pct / 100} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Assignments (most recent submitted — max 5) */}
          <div className="bg-white shadow-md rounded-xl p-4"
           style={{
                  boxShadow: "var(--shadow-soft)",
                }}>
            <h3 className="font-semibold text-[var(--color-primary)] mb-3">Recent Assignments</h3>
            <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-left text-grey-500">
                  <th className="px-2 py-2 whitespace-nowrap">Assignment</th>
                  <th className="px-2 py-2 whitespace-nowrap">Course</th>
                  <th className="px-2 py-2 whitespace-nowrap">Due</th>
                  <th className="px-2 py-2 whitespace-nowrap">Grade</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const assignments = data.assignments ?? [];
                  const grades = data.grades ?? [];
                  const courses = data.courses ?? [];

                  // Augment assignments with grade, course and parsed due date
                  const augmented = assignments.map((a) => {
                    const g = grades.find((x) => x.a_id === a.a_id);
                    const course = courses.find((x) => x.c_id === a.c_id);
                    const dueRaw = (a as any).due ?? (a as any).due_date ?? null;
                    const due = dueRaw ? new Date(dueRaw) : null;
                    return { a, g, course, due };
                  });

                  // Keep only submitted (or graded) assignments that have a due date
                  const submitted = augmented
                    .filter((x) => x.g && (x.g.status === "Submitted" || x.g.score != null) && x.due)
                    .sort((x, y) => (y.due!.getTime() - x.due!.getTime()))
                    .slice(0, 5);

                  if (submitted.length === 0) {
                    return (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-gray-500 bg-white">
                          No recent submitted assignments.
                        </td>
                      </tr>
                    );
                  }

                  return submitted.map((s, i) => (
                    <tr key={s.a.a_id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="px-2 py-2 whitespace-nowrap">{s.a.a_name ?? s.a.a_id}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{s.course ? s.course.c_id : "-"}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{s.due ? s.due.toLocaleDateString() : "-"}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{s.g?.score ?? (s.g?.status ?? "-")}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* RIGHT 1/3 AREA */}
        <div className="space-y-6">
          <div className = "rounded-xl" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CalendarCard
              current={selectedDate}
              onChange={setSelectedDate}
              deadlinesByDate={deadlinesByDate}
            />
          </div>

          <div className="bg-[var(--color-primary)] text-white rounded-xl p-4" style={{ boxShadow: "var(--shadow-soft)" }}>
            <h3 className="font-semibold mb-2">
              {selectedDate.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            {selectedDeadlines.length > 0 ? (
              <ul className="text-sm space-y-1">
                {selectedDeadlines.map((d, i) => (
                  <li key={i}>
                    {d.course_code} — {d.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm opacity-90">No deadlines on this date</p>
            )}
          </div>

          <div className="bg-white shadow-md rounded-xl p-4" style={{ boxShadow: "var(--shadow-soft)" }}>
            <h3 className="font-semibold text-[var(--color-primary)] mb-3">
              Upcoming Deadlines
            </h3>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm opacity-90">No upcoming deadlines</p>
            ) : (
              <ul className="text-sm space-y-2">
                {upcomingDeadlines.map((d: any, i: number) => (
                  <li key={i}>
                    <p className="font-medium">
                      {d.course_code} - {d.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {d.due ? d.due.toLocaleDateString() : "-"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
