import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import Card from "../components/Card";

function pct(n: number) { return `${Math.round(n * 100)}%`; }

export default function Dashboard() {
  const [data, setData] = useState<DashboardDTO | null>(null);

  useEffect(() => {
    getDashboard("S001", "Spring 2024").then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading…</div>;
  const { metrics, student } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* student banner */}
        <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Student</p>
            <p className="text-lg font-semibold">{student.name}</p>
            <p className="text-xs text-gray-500">{student.program} • {student.level}</p>
          </div>
          <div className="text-xs text-gray-500">
            <p>Email: <span className="font-medium text-gray-700">{student.mail_id}</span></p>
            <p>Admit Term: <span className="font-medium text-gray-700">{student.admit_term}</span></p>
          </div>
        </div>

        {/* key metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Overall Progress"><p className="text-3xl font-bold">{pct(metrics.overall_progress_pct)}</p></Card>
          <Card title="GPA"><p className="text-3xl font-bold">{metrics.gpa.toFixed(2)}</p></Card>
          <Card title="Attendance"><p className="text-3xl font-bold">{pct(metrics.attendance_pct)}</p></Card>
          <Card title="Alerts"><p className="text-3xl font-bold">{metrics.alerts_unread}</p></Card>
        </section>

        {/* courses + deadlines */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-3">Current Courses</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
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
            <Card>
              <h2 className="text-lg font-semibold mb-3">Upcoming Deadlines</h2>
              <ul className="space-y-3 text-sm">
                {data.deadlines.map((d, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{d.course_code} — {d.label}</p>
                      <p className="text-xs text-gray-500">{d.status}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{d.due_date}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold mb-3">Personalized Recommendations</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {data.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Card>
          </div>
        </section>

        {/* assignments snapshot */}
        <section className="grid grid-cols-1 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-3">Recent Assignment Scores</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
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
