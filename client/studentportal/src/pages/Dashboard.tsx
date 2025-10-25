import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import Card from "../components/Card";
import Progress from "../components/Progress";
import { Badge } from "../components/Badge";

function pct(n: number) { return `${Math.round(n * 100)}%`; }
function tone(status: "ok"|"due_soon"|"overdue") {
  return status === "ok" ? "green" : status === "due_soon" ? "amber" : "red";
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardDTO | null>(null);

  useEffect(() => { getDashboard("S001", "Spring 2024").then(setData); }, []);
  if (!data) return <div className="p-6">Loading…</div>;

  const { metrics, student } = data;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 space-y-6">

        {/* student banner */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Student</p>
              <p className="text-lg font-semibold">{student.name}</p>
              <p className="text-xs text-slate-500">{student.program} • {student.level}</p>
            </div>
            <div className="text-xs text-slate-600">
              <p>Email: <span className="font-medium text-slate-800">{student.mail_id}</span></p>
              <p>Admit Term: <span className="font-medium text-slate-800">{student.admit_term}</span></p>
            </div>
          </div>
        </Card>

        {/* key metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Overall Progress" right={<span className="text-sm font-bold">{pct(metrics.overall_progress_pct)}</span>}>
            <Progress value={metrics.overall_progress_pct} />
          </Card>
          <Card title="GPA">
            <p className="text-3xl font-bold">{metrics.gpa.toFixed(2)}</p>
          </Card>
          <Card title="Attendance" right={<span className="text-sm font-bold">{pct(metrics.attendance_pct)}</span>}>
            <Progress value={metrics.attendance_pct} />
          </Card>
          <Card title="Unread Alerts">
            <p className="text-3xl font-bold">{metrics.alerts_unread}</p>
          </Card>
        </section>

        {/* courses + deadlines */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Current Courses">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Code</th><th>Title</th><th>Credits</th>
                </tr>
              </thead>
              <tbody>
                {data.courses.map(c => (
                  <tr key={c.c_id} className="border-t">
                    <td className="py-2 font-medium">{c.c_code}</td>
                    <td>{c.c_title}</td>
                    <td>{c.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card title="Upcoming Deadlines">
              <ul className="space-y-3 text-sm">
                {data.deadlines.map((d, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{d.course_code} — {d.label}</p>
                      <p className="text-xs text-slate-500 capitalize">{d.status.replace("_"," ")}</p>
                    </div>
                    <Badge tone={tone(d.status)}>{d.due_date}</Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Personalized Recommendations">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {data.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Card>
          </div>
        </section>

        {/* assignments snapshot */}
        <section className="grid grid-cols-1 gap-6">
          <Card title="Recent Assignment Scores" subtitle="Latest 6 submissions">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Assignment</th><th>Course</th><th>Score</th><th>Status</th><th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.grades.slice(0,6).map(g => {
                  const a = data.assignments.find(x => x.a_id === g.a_id);
                  const c = a ? data.courses.find(x => x.c_id === a.c_id) : undefined;
                  return (
                    <tr key={g.g_id} className="border-t">
                      <td className="py-2">{a?.a_name ?? g.a_id}</td>
                      <td>{c?.c_code ?? "-"}</td>
                      <td>{g.score}</td>
                      <td>{g.status}</td>
                      <td>{g.submitted_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    </div>
  );
}
