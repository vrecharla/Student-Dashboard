// src/pages/Academic.tsx
import { useEffect, useMemo, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import Card from "../components/Card";

// inline pill to avoid extra imports
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-2 rounded-full bg-purple-700 text-white text-sm font-semibold shadow-[0_12px_28px_-14px_rgba(107,33,168,0.55)] w-max mx-auto">
      {children}
    </div>
  );
}

export default function Academic() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // 1) hooks are always called in the same order
  useEffect(() => {
    getDashboard("S001", "Spring 2024").then(setData).catch((e) => setErr(String(e)));
  }, []);

  // 2) compute rows/cards even when data is null (return empty)
  const courseCards = useMemo(() => (data?.courses ?? []).slice(0, 3), [data?.courses]);

  const rows = useMemo(() => {
    if (!data) return [];
    const courses = data.courses ?? [];
    const assignments = data.assignments ?? [];
    const grades = data.grades ?? [];

    return assignments.map((a) => {
      const c = courses.find((x) => x.c_id === a.c_id);
      const g = grades.find((x) => x.a_id === a.a_id);
      const due = a.due ? new Date(a.due) : null;
      const dueText =
        due && !isNaN(due.getTime())
          ? due.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
          : "—";
      return {
        name: a.a_name ?? a.a_id,
        course: c?.c_code ?? a.c_id,
        status: g?.status ?? "Pending",
        grade: g ? String(g.score) : "—",
        max: a.max_score ?? "—",
        due: dueText,
      };
    });
  }, [data]);

  // 3) now it's safe to early-return UI (hooks already ran)
  if (err) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto p-6">
          <Card>
            <p className="text-rose-700 font-semibold">Couldn’t load Academic page</p>
            <p className="text-sm text-slate-600 mt-1">{err}</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto p-6">
          <Card>Loading…</Card>
        </div>
      </div>
    );
  }

  // derive enrollments safely
  const enrollments = data.enrollments ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* top pill */}
        <div className="grid place-items-center">
          <Pill>STUDENT DASHBOARD PORTAL</Pill>
        </div>

        {/* Enrolled courses header */}
        <div className="h-10 rounded-full bg-purple-700 text-white font-semibold grid place-items-center shadow-[0_12px_28px_-14px_rgba(107,33,168,0.55)] w-full max-w-sm mx-auto">
          Enrolled courses
        </div>

        {/* 3 course cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courseCards.map((c, i) => {
            const enr = enrollments.find((e) => e.c_id === c.c_id);
            const hours = enr?.overall_hours ?? 40;
            return (
              <div
                key={c.c_id}
                className="bg-white rounded-2xl p-5 shadow-[0_18px_38px_-20px_rgba(15,23,42,0.35)] border border-slate-200"
              >
                {/* want real names? replace with {c.c_title} */}
                <h3 className="text-xl font-bold">Course Name {i + 1}</h3>
                <p className="text-slate-700 font-semibold mt-1">{c.c_code}</p>
                <div className="mt-4 space-y-1 text-sm">
                  <p className="text-slate-700"><span className="font-semibold">Instructor</span>: Instructor Name {i + 1}</p>
                  <p className="text-slate-700"><span className="font-semibold">Credits</span>: {c.credits}</p>
                  <p className="text-slate-700"><span className="font-semibold">Overall hours</span>: {hours}</p>
                </div>
              </div>
            );
          })}
          {courseCards.length === 0 && <Card>No courses found.</Card>}
        </div>

        {/* Assignment details header */}
        <div className="h-10 rounded-full bg-purple-700 text-white font-semibold grid place-items-center shadow-[0_12px_28px_-14px_rgba(107,33,168,0.55)] w-full max-w-sm mx-auto">
          Assignment Details
        </div>

        {/* Assignment table */}
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-2">Assignment Name</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Grade</th>
                <th>Max Grade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={["border-t", i % 2 ? "bg-slate-50/60" : ""].join(" ")}>
                  <td className="py-2">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.course}</div>
                  </td>
                  <td>{r.status}</td>
                  <td>{r.due}</td>
                  <td>{r.grade}</td>
                  <td>{r.max}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-slate-500">No assignments found.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
