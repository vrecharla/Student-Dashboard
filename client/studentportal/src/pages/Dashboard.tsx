import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import Progress from "../components/Progress";
import PageLoader from "../components/PageLoader";
import Bottom from "../components/Bottom";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    getDashboard("S001", "Spring 2024")
      .then(setData)
      .catch(() => {
        // Dummy fallback data
        setData({
          student: { name: "John Doe" },
          metrics: { gpa: 3.8, attendance_pct: 0.94 },
          financeSummary: { balance_due: 300 },
          courses: [
            { c_id: "C1", c_title: "Data Structures", c_code: "CS201", credits: 3 },
            { c_id: "C2", c_title: "Operating Systems", c_code: "CS301", credits: 4 },
            { c_id: "C3", c_title: "Discrete Math", c_code: "MTH220", credits: 3 },
          ],
          attendance: [
            { c_id: "C1", attendance_pct: 95 },
            { c_id: "C2", attendance_pct: 90 },
            { c_id: "C3", attendance_pct: 88 },
          ],
          deadlines: [
            { course_code: "CS201", label: "Project Due", due_date: new Date().toISOString() },
            {
              course_code: "MTH220",
              label: "Midterm Exam",
              due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
            },
          ],
          assignments: [
            { a_id: "A1", a_name: "Lab Report", c_id: "C1" },
            { a_id: "A2", a_name: "Essay", c_id: "C3" },
          ],
          grades: [
            { g_id: "G1", a_id: "A1", score: "A" },
            { g_id: "G2", a_id: "A2", score: "B+" },
          ],
        } as any);
      });
  }, []);

  if (!data) return <PageLoader />;

  const { metrics, student } = data;

  // Group deadlines by date
  const deadlinesByDate = new Map<string, any[]>();
  data.deadlines.forEach((d) => {
    const key = new Date(d.due_date).toDateString();
    if (!deadlinesByDate.has(key)) deadlinesByDate.set(key, []);
    deadlinesByDate.get(key)!.push(d);
  });
  const selectedDeadlines = deadlinesByDate.get(selectedDate.toDateString()) || [];

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
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Course Name</th>
                    <th>Code</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {data.courses.map((c, i) => (
                    <tr key={c.c_id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="py-2">{c.c_title}</td>
                      <td>{c.c_code}</td>
                      <td>{c.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

          {/* Recent Assignments */}
          <div className="bg-white shadow-md rounded-xl p-4"
           style={{
                  boxShadow: "var(--shadow-soft)",
                }}>
            <h3 className="font-semibold text-[var(--color-primary)] mb-3">Recent Assignments</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-grey-500">
                  <th className="py-2">Assignment</th>
                  <th>Course</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {data.grades.map((g, i) => {
                  const a = data.assignments.find((x) => x.a_id === g.a_id);
                  const c = a ? data.courses.find((x) => x.c_id === a.c_id) : undefined;
                  return (
                    <tr key={g.g_id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="py-2">{a?.a_name ?? "-"}</td>
                      <td>{c?.c_code ?? "-"}</td>
                      <td>{g.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
            <ul className="text-sm space-y-2">
              {data.deadlines.map((d, i) => (
                <li key={i}>
                  <p className="font-medium">
                    {d.course_code} - {d.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(d.due_date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
