// src/pages/Attendance.tsx
import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import Card from "../components/Card";
import SectionPill from "../components/SectionPill";
import Progress from "../components/Progress";

export default function Attendance() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  useEffect(() => { getDashboard("S001", "Spring 2024").then(setData); }, []);
  if (!data) return <div className="p-6">Loading…</div>;

  const notes = [
    "Course Name 2 - Below required attendance (75%)",
    "Course Name 1 - Approaching risk threshold.",
    "Course Name 3 - Current attendance is good.",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="grid place-items-center">
          <SectionPill>STUDENT DASHBOARD PORTAL</SectionPill>
        </div>

        <div className="h-10 rounded-full bg-purple-700 text-white font-semibold grid place-items-center shadow-[0_12px_28px_-14px_rgba(107,33,168,0.55)] w-full max-w-sm mx-auto">
          Attendance
        </div>

        <Card title="Attendance Status">
          <div className="space-y-5">
            {data.attendance.map(a => {
              const c = data.courses.find(x => x.c_id === a.c_id);
              const pct = Math.max(0, Math.min(100, a.attendance_pct));
              return (
                <div key={a.record_id}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-slate-500">{c?.c_code}</p>
                      <p className="font-semibold">{c?.c_title}</p>
                    </div>
                    <p className="font-semibold">{pct}%</p>
                  </div>
                  <Progress value={pct/100} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <ul className="list-disc pl-5 text-sm space-y-2">
            {notes.map((n,i) => <li key={i}>{n}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
}
