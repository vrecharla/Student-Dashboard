// src/pages/Analysis.tsx
import React, { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import { getStudentId } from "../lib/auth";
import PageLoader from "../components/PageLoader";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts";

type Point = {
  attendance_pct: number;
  Term_GPA: number;
};

const scatterData: Point[] = [
  { attendance_pct: 90.0, Term_GPA: 4.0 },
  { attendance_pct: 90.0, Term_GPA: 3.5 },
  { attendance_pct: 88.4, Term_GPA: 2.7 },
  { attendance_pct: 83.0, Term_GPA: 3.8 },
  { attendance_pct: 66.6, Term_GPA: 3.64 },
  { attendance_pct: 64.2, Term_GPA: 1.5 },
  { attendance_pct: 82.4, Term_GPA: 3.66 },
  { attendance_pct: 84.4, Term_GPA: 3.8 },
  { attendance_pct: 78.4, Term_GPA: 3.0 },
  { attendance_pct: 79.4, Term_GPA: 3.84 },
  { attendance_pct: 82.6, Term_GPA: 2.0 },
  { attendance_pct: 83.2, Term_GPA: 3.62 },
  { attendance_pct: 84.8, Term_GPA: 3.54 },
  { attendance_pct: 83.4, Term_GPA: 3.81 },
  { attendance_pct: 87.0, Term_GPA: 3.97 },
  { attendance_pct: 89.6, Term_GPA: 3.56 },
  { attendance_pct: 87.4, Term_GPA: 4.0 },
  { attendance_pct: 89.0, Term_GPA: 3.72 },
  { attendance_pct: 89.0, Term_GPA: 3.2 },
  { attendance_pct: 90.8, Term_GPA: 3.96 },
  { attendance_pct: 68.6, Term_GPA: 2.87 },
  { attendance_pct: 87.6, Term_GPA: 3.84 },
  { attendance_pct: 84.4, Term_GPA: 4.0 },
  { attendance_pct: 81.2, Term_GPA: 3.17 },
  { attendance_pct: 82.8, Term_GPA: 3.64 },
  { attendance_pct: 91.8, Term_GPA: 3.84 },
  { attendance_pct: 93.2, Term_GPA: 3.66 },
  { attendance_pct: 82.6, Term_GPA: 3.6 },
  { attendance_pct: 87.4, Term_GPA: 3.85 },
  { attendance_pct: 67.4, Term_GPA: 2.47 },
  { attendance_pct: 84.4, Term_GPA: 3.7 },
  { attendance_pct: 80.4, Term_GPA: 3.09 },
  { attendance_pct: 67.2, Term_GPA: 2.62 },
  { attendance_pct: 81.4, Term_GPA: 3.6 },
  { attendance_pct: 85.8, Term_GPA: 3.57 },
  { attendance_pct: 70.4, Term_GPA: 2.73 },
  { attendance_pct: 69.8, Term_GPA: 2.67 },
  { attendance_pct: 84.0, Term_GPA: 3.76 },
  { attendance_pct: 69.8, Term_GPA: 2.61 },
  { attendance_pct: 84.4, Term_GPA: 4.0 },
  { attendance_pct: 78.8, Term_GPA: 3.38 },
  { attendance_pct: 69.0, Term_GPA: 2.58 },
  { attendance_pct: 84.2, Term_GPA: 3.59 },
  { attendance_pct: 71.6, Term_GPA: 2.67 },
  { attendance_pct: 89.8, Term_GPA: 4.0 },
  { attendance_pct: 85.8, Term_GPA: 4.0 },
  { attendance_pct: 72.2, Term_GPA: 2.76 },
  { attendance_pct: 73.0, Term_GPA: 2.63 },
  { attendance_pct: 87.6, Term_GPA: 3.77 },
  { attendance_pct: 73.0, Term_GPA: 2.84 },
  { attendance_pct: 84.0, Term_GPA: 3.65 },
  { attendance_pct: 65.8, Term_GPA: 1.89 },
  { attendance_pct: 66.2, Term_GPA: 1.53 },
  { attendance_pct: 83.0, Term_GPA: 4.0 },
  { attendance_pct: 68.4, Term_GPA: 2.5 },
  { attendance_pct: 79.6, Term_GPA: 3.37 },
  { attendance_pct: 84.2, Term_GPA: 3.63 },
  { attendance_pct: 82.6, Term_GPA: 3.53 },
  { attendance_pct: 84.2, Term_GPA: 3.61 },
  { attendance_pct: 70.6, Term_GPA: 2.85 },
  { attendance_pct: 66.8, Term_GPA: 1.74 },
  { attendance_pct: 86.2, Term_GPA: 2.84 },
  { attendance_pct: 89.2, Term_GPA: 2.93 },
  { attendance_pct: 85.2, Term_GPA: 3.65 },
  { attendance_pct: 88.4, Term_GPA: 3.56 },
  { attendance_pct: 85.6, Term_GPA: 2.94 },
  { attendance_pct: 79.8, Term_GPA: 3.45 },
  { attendance_pct: 82.6, Term_GPA: 3.58 },
  { attendance_pct: 89.8, Term_GPA: 3.74 },
  { attendance_pct: 79.8, Term_GPA: 3.27 },
  { attendance_pct: 89.2, Term_GPA: 4.0 },
  { attendance_pct: 69.4, Term_GPA: 2.3 },
  { attendance_pct: 82.6, Term_GPA: 3.71 },
  { attendance_pct: 84.2, Term_GPA: 3.78 },
  { attendance_pct: 78.8, Term_GPA: 3.05 },
  { attendance_pct: 92.0, Term_GPA: 4.0 },
  { attendance_pct: 86.2, Term_GPA: 3.91 },
  { attendance_pct: 82.2, Term_GPA: 3.84 },
  { attendance_pct: 80.2, Term_GPA: 3.93 },
  { attendance_pct: 90.8, Term_GPA: 4.0 },
  { attendance_pct: 85.6, Term_GPA: 4.0 },
  { attendance_pct: 87.2, Term_GPA: 3.79 },
  { attendance_pct: 68.8, Term_GPA: 1.58 },
  { attendance_pct: 87.0, Term_GPA: 4.0 },
  { attendance_pct: 89.2, Term_GPA: 3.49 },
  { attendance_pct: 64.8, Term_GPA: 2.52 },
  { attendance_pct: 81.2, Term_GPA: 3.09 },
  { attendance_pct: 83.0, Term_GPA: 3.03 },
  { attendance_pct: 84.2, Term_GPA: 3.66 },
  { attendance_pct: 67.6, Term_GPA: 2.94 },
  { attendance_pct: 84.0, Term_GPA: 3.92 },
  { attendance_pct: 72.8, Term_GPA: 1.94 },
  { attendance_pct: 66.2, Term_GPA: 2.47 },
  { attendance_pct: 74.8, Term_GPA: 2.55 },
  { attendance_pct: 88.0, Term_GPA: 3.84 },
  { attendance_pct: 84.6, Term_GPA: 3.76 },
  { attendance_pct: 65.0, Term_GPA: 1.96 },
  { attendance_pct: 74.4, Term_GPA: 2.63 },
  { attendance_pct: 83.8, Term_GPA: 3.7 },
  { attendance_pct: 86.2, Term_GPA: 3.82 },
];

const submissionData = [
  { title: "Data Structures", no_count: 56, yes_count: 244 },
  { title: "Database Systems", no_count: 42, yes_count: 258 },
  { title: "Intro to Programming", no_count: 38, yes_count: 262 },
  { title: "Statistics", no_count: 42, yes_count: 258 },
  { title: "Web Development", no_count: 45, yes_count: 255 },
];

const submissionGPAData = [
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.5, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.7, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.8, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 2.64, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 1.5, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.66, submission_rate: 0.8 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.8, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.0, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.84, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.8 },
  { assignments_submitted: 9, total_assignments: 15, avg_gpa: 3.62, submission_rate: 0.6 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.54, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 10, total_assignments: 15, avg_gpa: 3.81, submission_rate: 0.6666666666666666 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.97, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.56, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.72, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.2, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.96, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 2.87, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.84, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.17, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.64, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.84, submission_rate: 0.8 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.66, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.6, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.85, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 2.47, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.7, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 15, total_assignments: 15, avg_gpa: 3.09, submission_rate: 1.0 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 2.62, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.6, submission_rate: 0.8 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.57, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 2.73, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 2.67, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.76, submission_rate: 0.8 },
  { assignments_submitted: 15, total_assignments: 15, avg_gpa: 2.61, submission_rate: 1.0 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.38, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 2.58, submission_rate: 0.8 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.59, submission_rate: 0.8 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 2.67, submission_rate: 0.8 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 2.76, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 15, total_assignments: 15, avg_gpa: 2.63, submission_rate: 1.0 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.77, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 10, total_assignments: 15, avg_gpa: 2.84, submission_rate: 0.6666666666666666 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.65, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 1.89, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 1.53, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 2.5, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.37, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.63, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.53, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.61, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 2.85, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 1.74, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 2.84, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 2.93, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.65, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.56, submission_rate: 0.8 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 2.94, submission_rate: 0.8 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.45, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.58, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.74, submission_rate: 0.8 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.27, submission_rate: 0.8 },
  { assignments_submitted: 15, total_assignments: 15, avg_gpa: 4.0, submission_rate: 1.0 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 2.3, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.71, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.78, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.05, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.91, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.84, submission_rate: 0.8 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.93, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.8 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.79, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 1.58, submission_rate: 0.8 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 4.0, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.49, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 2.52, submission_rate: 0.8 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.09, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.03, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 13, total_assignments: 15, avg_gpa: 3.66, submission_rate: 0.8666666666666667 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 2.94, submission_rate: 0.8 },
  { assignments_submitted: 15, total_assignments: 15, avg_gpa: 3.92, submission_rate: 1.0 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 1.94, submission_rate: 0.7333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 2.47, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 2.55, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.84, submission_rate: 0.8 },
  { assignments_submitted: 12, total_assignments: 15, avg_gpa: 3.76, submission_rate: 0.8 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 1.96, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 2.63, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 14, total_assignments: 15, avg_gpa: 3.7, submission_rate: 0.9333333333333333 },
  { assignments_submitted: 11, total_assignments: 15, avg_gpa: 3.82, submission_rate: 0.7333333333333333 },
];

const courseAvgScoreData = [
  { title: "Data Structures", course_avg_score: 79.07 },
  { title: "Database Systems", course_avg_score: 78.97 },
  { title: "Operating Systems", course_avg_score: 79.08 },
  { title: "Software Engineering", course_avg_score: 78.73 },
  { title: "Web Development", course_avg_score: 78.55 },
];

const financePieData = [
  { name: "Paid", value: 88 },
  { name: "Balance Due", value: 12 },
];

const genderDonutData = [
  { name: "Male", value: 55 },
  { name: "Female", value: 45 },
];



// shared for both pie label helpers
const RADIAN = Math.PI / 180;

// ---- FIXED GENDER LABELS (clean spacing + correct position) ----
const renderGenderLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, name, value } = props;

  const radius = outerRadius + 22;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = name === "Male" ? "#1a66e0ff" : "#bf2673ff";

  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={13}
      fontWeight={600}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name}: ${value}%`}
    </text>
  );
};

// labels with arrow lines for finance chart
const renderFinanceLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, name, percent } = props;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = name === "Paid" ? "#11a949ff" : "#8f1326ff";

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: 12, fontWeight: 600 }}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default function Analysis() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const sId = getStudentId() || "S3001";
    getDashboard(sId, "Spring 2024")
      .then(setData)
      .catch((e) => setErr(String(e ?? "Failed to load analysis data")));
  }, []);

  if (err) {
    return (
      <div className="p-6 text-red-600">
        Could not load analysis: {err}
      </div>
    );
  }

  if (!data) {
    return <PageLoader />;
  }

  const cardClass =
    "bg-white rounded-2xl p-5 shadow-sm border border-gray-100";

  return (
    <div className="px-6 pb-10 space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
        </h2>

      <div
        className="rounded-xl text-white text-left text-xl px-10 py-2 font-bold"
        style={{
        backgroundColor: "var(--color-primary)",
        boxShadow: "var(--shadow-soft)",
      }}
      >
        Analysis
      </div>
        <p className="text-sm text-black-500">
          High-level patterns between attendance, submissions, grades, and
          student profile.
        </p>
      </div>

      {/* Attendance vs GPA */}
      <section className={cardClass}>
        <h3 className="font-bold text-[var(--color-primary)] mb-1">
          Average Attendance vs GPA
        </h3>
        <p className="text-xs text-black-500 mb-4">
          Each dot represents a student. Lower attendance generally aligns with
          lower term GPA.
        </p>

        {(() => {
          const minAttendance = Math.min(
            ...scatterData.map((d) => d.attendance_pct)
          );
          const xMin = Math.max(0, minAttendance - 5);
          const xMax = 100;

          return (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <ScatterChart
                  margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
                >
                  <CartesianGrid stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    dataKey="attendance_pct"
                    name="Attendance"
                    unit="%"
                    domain={[xMin, xMax]}
                    tick={{
                      fill: "#000000",
                      fontSize: 12,
                      fontWeight: 600,
                    } as any}
                    label={{
                      value: "Attendance (%)",
                      position: "bottom",
                      style: {
                        fill: "#000000",
                        fontWeight: 700,
                        fontSize: 13,
                      },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="Term_GPA"
                    name="GPA"
                    domain={[0, 4]}
                    tick={{
                      fill: "#000000",
                      fontSize: 12,
                      fontWeight: 600,
                    } as any}
                    label={{
                      value: "Term GPA",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: "#000000",
                        fontWeight: 700,
                        fontSize: 13,
                      },
                    }}
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    name="Students"
                    data={scatterData}
                    fill="#5a3c8dff"
                    shape="circle"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          );
        })()}
      </section>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Course Assignment Submissions */}
        <section className={cardClass}>
          <h3 className="font-bold text-[var(--color-primary)] mb-1">
            Course Assignment Submissions
          </h3>
          <p className="text-xs text-black-500 mb-4">
            Comparison of on-time vs missing assignment submissions across
            courses.
          </p>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart
                data={submissionData}
                margin={{ top: 10, right: 20, left: 60, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="title"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  tick={{
                    fontSize: 11,
                    fill: "#000000",
                    fontWeight: 600,
                  } as any}
                  label={{
                    value: "Course name",
                    position: "bottom",
                    offset: 20,
                    style: {
                      fill: "#000000",
                      fontWeight: 700,
                      fontSize: 13,
                    },
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#000000",
                    fontWeight: 600,
                  } as any}
                  label={{
                    value: "Assignment submissions",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fill: "#000000",
                      fontWeight: 700,
                      fontSize: 13,
                    },
                  }}
                />
                <Tooltip />
                <Legend verticalAlign="top" height={24} />
                <Bar
                  dataKey="no_count"
                  name="Not submitted"
                  fill="#870b0dff"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="yes_count"
                  name="Submitted"
                  fill="#13b752ff"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Assignments Submitted vs Avg GPA */}
        <section className={cardClass}>
          <h3 className="font-bold text-[var(--color-primary)] mb-1">
            Assignments Submitted vs Avg GPA
          </h3>
          <p className="text-xs text-black-500 mb-4">
            Students who submit more assignments tend to maintain stronger GPAs.
          </p>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <ScatterChart
                margin={{ top: 10, right: 20, bottom: 40, left: 60 }}
              >
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="assignments_submitted"
                  name="Assignments Submitted"
                  domain={[0, 15]}
                  tick={{
                    fontSize: 11,
                    fill: "#000000",
                    fontWeight: 600,
                  } as any}
                  label={{
                    value: "Assignments submitted (out of 15)",
                    position: "bottom",
                    style: {
                      fill: "#000000",
                      fontWeight: 700,
                      fontSize: 13,
                    },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="avg_gpa"
                  name="Average GPA"
                  domain={[0, 4]}
                  tick={{
                    fontSize: 11,
                    fill: "#000000",
                    fontWeight: 600,
                  } as any}
                  label={{
                    value: "Average GPA",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fill: "#000000",
                      fontWeight: 700,
                      fontSize: 13,
                    },
                  }}
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Students"
                  data={submissionGPAData}
                  fill="#43237aff"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Next row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Course Average Scores */}
        <section className={cardClass}>
          <h3 className="font-bold text-[var(--color-primary)] mb-1">
            Course Average Scores
          </h3>
          <p className="text-xs text-black-500 mb-4">
            Average performance by course across all enrolled students.
          </p>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart
                data={courseAvgScoreData}
                margin={{ top: 10, right: 20, left: 60, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="title"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  tick={{
                    fontSize: 11,
                    fill: "#000000",
                    fontWeight: 600,
                  } as any}
                  label={{
                    value: "Course name",
                    position: "bottom",
                    offset: 20,
                    style: {
                      fill: "#000000",
                      fontWeight: 700,
                      fontSize: 13,
                    },
                  }}
                />
                <YAxis
                  domain={[70, 85]}
                  tick={{
                    fontSize: 11,
                    fill: "#000000",
                    fontWeight: 600,
                  } as any}
                  label={{
                    value: "Average score",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fill: "#000000",
                      fontWeight: 700,
                      fontSize: 13,
                    },
                  }}
                />
                <Tooltip />
                <Bar
                  dataKey="course_avg_score"
                  name="Average score"
                  radius={[8, 8, 0, 0]}
                >
                  <Cell fill="#4e0fbaff" />
                  <Cell fill="#068234ff" />
                  <Cell fill="#314b75ff" />
                  <Cell fill="#714c0bff" />
                  <Cell fill="#991212ff" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Paid vs Balance Due */}
        <section className={cardClass}>
          <h3 className="font-bold text-[var(--color-primary)] mb-1">
            Paid vs Balance Due
          </h3>
          <p className="text-xs text-black-500 mb-4">
            Total number of students who paid the tuition fee this term.
          </p>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={financePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
                  label={renderFinanceLabel}
                >
                  <Cell fill="#11a949ff" /> {/* Paid */}
                  <Cell fill="#8f1326ff" /> {/* Balance due */}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={24} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Gender Distribution */}
      <section className={cardClass}>
  <h3 className="font-bold text-[var(--color-primary)] mb-1">
    Gender Distribution
  </h3>
  <p className="text-xs text-black-500 mb-4">
    High-level gender split for the current cohort.
  </p>

  <div style={{ width: "100%", height: 260 }}>
    <ResponsiveContainer>
      <PieChart>
  <Pie
    data={genderDonutData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={100}
    labelLine={{ stroke: "#b3b3b3", strokeWidth: 1 }}
    label={renderGenderLabel}
  >
    <Cell fill="#1a66e0ff" />   {/* Male */}
    <Cell fill="#bf2673ff" />   {/* Female */}
  </Pie>

  {/* ⭐ Added legend on the right side */}
  <Legend
    layout="vertical"
    align="right"
    verticalAlign="middle"
    iconType="circle"
    wrapperStyle={{ right: 150 }}
  />
</PieChart>

    </ResponsiveContainer>
  </div>
</section>
    </div>
  );
}
