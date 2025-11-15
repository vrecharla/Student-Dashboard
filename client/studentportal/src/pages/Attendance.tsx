import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import PageLoader from "../components/PageLoader";

export default function Attendance() {
  const [data, setData] = useState<DashboardDTO | null>(null);

  useEffect(() => {
    getDashboard("S001", "Spring 2024").then(setData);
  }, []);

  if (!data) return ( <PageLoader /> );

    // Build dynamic messages based on actual attendance
  const getStatusMessage = (courseTitle: string, pct: number) => {
    if (pct < 75) return `${courseTitle} - Below required attendance (${pct}%).`;
    if (pct < 85) return `${courseTitle} - Approaching risk threshold (${pct}%).`;
    return `${courseTitle} - Current attendance is good (${pct}%).`;
  };

  // Color selection based on attendance
  const getStatusColor = (pct: number) => {
    if (pct < 75) return "var(--color-danger)";
    if (pct < 85) return "var(--color-warning)";
    return "var(--color-success)";
  };


  return (
      <div className="space-y-10 px-6">
        {/* Attendance title pill */}
        <div
          className="rounded-xl text-white text-left text-xl px-10 py-2 font-bold"
          style={{
          backgroundColor: "var(--color-primary)",
          boxShadow: "var(--shadow-soft)",
        }}
        >
          Attendance Overview
        </div>

        {/* Attendance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-3">
          {data.attendance.slice(0, 3).map((a, i) => {
            const c = data.courses.find(x => x.c_id === a.c_id);
            const pct = Math.max(0, Math.min(100, a.attendance_pct));

            return (
              <div
                key={a.record_id}
                className="rounded-2xl p-6 bg-white"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <p className="text-lg font-bold">{c?.c_code}</p>
                <p className="text-md text-grey-600 mb-6 border-b-4 border-[var(--color-primary)]">
                  {c?.c_title ?? "Course Name"}
                </p>

                {/* Circular progress */}
                <div className="flex items-center justify-center">
                  <svg width="110" height="110">
                    <circle
                      cx="55"
                      cy="55"
                      r="45"
                      fill="none"
                      stroke="rgba(87,50,137,0.15)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="55"
                      cy="55"
                      r="45"
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="10"
                      strokeDasharray={`${(pct / 100) * 2 * Math.PI * 45} ${
                        2 * Math.PI * 45
                      }`}
                      strokeLinecap="round"
                      transform="rotate(-90 55 55)"
                    />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fontSize="20"
                      fontWeight="700"
                      fill="#000"
                    >
                      {pct}%
                    </text>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Attendance Status */}
        <div
          className="rounded-xl text-white text-left text-xl px-10 py-2 font-bold"
          style={{
          backgroundColor: "var(--color-primary)",
          boxShadow: "var(--shadow-soft)",
        }}
        >
          Attendance Status
        </div>

        {/* Status Bars */}
        <div className="space-y-4">
          {data.attendance.slice(0, 3).map((a) => {
            const c = data.courses.find(x => x.c_id === a.c_id);
            const pct = Math.max(0, Math.min(100, a.attendance_pct));

            return (
              <div
                key={a.record_id}
                className="text-white py-3 px-4 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: getStatusColor(pct),
                  color: "black",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                {getStatusMessage(c?.c_title ?? "Course", pct)}
              </div>
            );
          })}
        </div>
      </div>
  );
}
