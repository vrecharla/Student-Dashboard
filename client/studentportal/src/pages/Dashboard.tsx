import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import Card from "../components/Card";
import KPI from "../components/KPI";
import MiniCalendar from "../components/MiniCalendar";
import Progress from "../components/Progress";
import { Badge } from "../components/Badge";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function tone(status: "ok" | "due_soon" | "overdue") {
  return status === "ok" ? "green" : status === "due_soon" ? "amber" : "red";
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  useEffect(() => {
    getDashboard("S001", "Spring 2024").then(setData);
  }, []);
  if (!data) return <div className="p-6">Loading…</div>;

  const { metrics, student } = data;
  const todayStr = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex" >

      {/* Dashboard content */}
      <div className="flex-1 p-8 space-y-8">

        {/* Hero Banner */}
        <div
          className="rounded-2xl p-6 text-white flex justify-between items-center shadow-lg"
          style={{ backgroundColor: "var(--color-primary)", boxShadow: "var(--shadow-soft)", }}
        >
          <div>
            <p className="text-sm opacity-90">{todayStr}</p>
            <h2 className="mt-1 text-2xl font-bold">
              Welcome back, {student.name.split(" ")[0]}!
            </h2>
            <p className="opacity-80 text-sm">
              Always stay updated in your student portal
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{student.level}</p>
            <p className="text-sm">{student.program}</p>
          </div>
        </div>

        {/* KPI strip */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <KPI label="GPA" value={metrics.gpa.toFixed(2)} />
          <KPI label="Attendance" value={pct(metrics.attendance_pct)} />
          <KPI
            label="Balance"
            value={`$ ${Math.max(0, data.financeSummary.balance_due).toFixed(0)}`}
          />
        </section>

        {/* Main three-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Courses + Attendance */}
          <div className="space-y-6">
            <Card title="Enrolled Courses">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2">Course Name</th>
                    <th>Code</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {data.courses.map((c, idx) => (
                    <tr
                      key={c.c_id}
                      className={["border-t", idx % 2 === 1 ? "bg-slate-50/40" : ""].join(" ")}
                    >
                      <td className="py-2">{c.c_title}</td>
                      <td>{c.c_code}</td>
                      <td>{c.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card title="Attendance">
              <div className="space-y-4">
                {data.attendance.slice(0, 2).map((a, i) => {
                  const course = data.courses.find((c) => c.c_id === a.c_id);
                  const v = Math.min(1, Math.max(0, a.attendance_pct / 100));
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">
                          {course?.c_title ?? a.c_id}
                        </p>
                        <p className="text-slate-700">{a.attendance_pct}%</p>
                      </div>
                      <Progress value={v} />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Middle column: Calendar + Daily Card */}
          <div className="space-y-6">
            <MiniCalendar />
            <Card
              title={new Date().toLocaleString(undefined, {
                day: "numeric",
                month: "short",
              })}
            >
              <p className="text-sm text-slate-600">No deadlines on this day</p>
            </Card>
          </div>

          {/* Right column: Deadlines + Submissions */}
          <div className="space-y-6">
            <Card title="Upcoming Deadlines">
              <ul className="space-y-4 text-sm">
                {data.deadlines.map((d, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {d.course_code} — {d.label}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(d.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge tone={tone(d.status)}>
                      {d.status.replace("_", " ")}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Recent Assignment Submissions">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2">Assignment Name</th>
                    <th>Course</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {data.grades.slice(0, 4).map((g, idx) => {
                    const a = data.assignments.find((x) => x.a_id === g.a_id);
                    const c = a
                      ? data.courses.find((x) => x.c_id === a.c_id)
                      : undefined;
                    return (
                      <tr
                        key={g.g_id}
                        className={["border-t", idx % 2 === 1 ? "bg-slate-50/40" : ""].join(" ")}
                      >
                        <td className="py-2">{a?.a_name ?? g.a_id}</td>
                        <td>{c?.c_code ?? "-"}</td>
                        <td>{g.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
