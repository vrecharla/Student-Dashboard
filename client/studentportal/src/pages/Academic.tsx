// src/pages/Academic.tsx
import { useEffect, useMemo, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import { getStudentId } from "../lib/auth";
import PageLoader from "../components/PageLoader";


export default function Academic() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    const sId = getStudentId() || "S3001";
    getDashboard(sId, "Spring 2024")
      .then((d) => {
        setData(d);
        if (d?.courses?.[0]) setSelectedCourse(d.courses[0].c_id);
      })
      .catch((e) => setErr(String(e)));
  }, []);

  const courses = data?.courses ?? [];
  const enrollments = data?.enrollments ?? [];

  const filteredAssignments = useMemo(() => {
    if (!data) return [];
    const assignments = data.assignments ?? [];
    const grades = data.grades ?? [];

    return assignments
      .filter((a) => (selectedCourse ? a.c_id === selectedCourse : true))
      .map((a) => {
        const g = grades.find((x) => x.a_id === a.a_id);
        const due = a.due ? new Date(a.due) : null;

        return {
          name: a.a_name ?? a.a_id,
          status: g?.status ?? "Pending",
          grade: g ? String(g.score) : "-",
          max: a.max_score ?? "—",
          due: due
            ? due.toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-",
        };
      });
  }, [data, selectedCourse]);

  if (err) {
    return <div className="p-6 text-red-600">Could not load Academic page: {err}</div>;
  }
  if (!data) return <PageLoader />;

  return (
    <div className="space-y-10 px-6">

      {/* Header chip */}
      <div
        className="rounded-xl text-white text-left text-xl px-10 py-2 font-bold"
        style={{
        backgroundColor: "var(--color-primary)",
        boxShadow: "var(--shadow-soft)",
      }}
      >
        Enrolled courses
      </div>

      {/* Course Cards */}
      <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {courses.map((c, index) => {
          const enr = enrollments.find((e) => e.c_id === c.c_id);
          const hours = enr?.overall_hours ?? 40;
          const isActive = selectedCourse === c.c_id;

          return (
            <div
              key={c.c_id}
              onClick={() => setSelectedCourse(c.c_id)}
              className="
                cursor-pointer rounded-3xl overflow-hidden
                transition-all
              "
              style={{
                transform: isActive ? "scale(1.02)" : "scale(1)",
                boxShadow: isActive ? "var(--shadow-select)": "var(--shadow-soft)",

              }}
            >
              {/* TOP SECTION — white */}
              <div
                className="p-5"
                style={{ backgroundColor: "var(--color-background)" }}
              >
                <h3 className="text-lg font-semibold">
                  {c.c_title ?? `Course Name ${index + 1}`}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{c.c_id}</p>
              </div>

              {/* BOTTOM SECTION — purple */}
              <div
                className="p-5 text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <p>{c.instructor_name ?? `Instructor ${index + 1}`}</p>
                <p>Credits: {c.credits}</p>
                <p>Overall hours: {hours}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Details Chip */}
      <div
        className="rounded-xl text-white text-left text-xl px-10 py-2 font-bold"
        style={{
        backgroundColor: "var(--color-primary)",
        boxShadow: "var(--shadow-soft)",
      }}
      >
        Assignment Details
      </div>

      {/* Assignment List */}
      <div className="mt-2 rounded-xl overflow-hidden w-full"
        style={{
          boxShadow: "var(--shadow-soft)",
        }}>
        <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-left font-semibold text-l underline underline-offset-4"
            style={{
              backgroundColor: "var(--color-background)",
              color: "var(--color-primary)",
            }}
            >
              <th className="px-6 py-2 whitespace-nowrap">Assignment Name</th>
              <th className="px-4 py-2 whitespace-nowrap">Status</th> 
              <th className="px-4 py-2 whitespace-nowrap">Due Date</th>
              <th className="px-4 py-2 whitespace-nowrap">Grade</th>
              <th className="px-4 py-2 whitespace-nowrap">Max Grade</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.map((r, i) => (
              <tr
                key={i}
                style={{
                    backgroundColor: i % 2 ? "var(--color-background)" : "rgba(var(--color-primary-rgb), 0.08)"
                  }}
              >
                <td className="px-6 py-2 whitespace-nowrap">{r.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{r.status}</td>
                <td className="px-4 py-2 whitespace-nowrap">{r.due}</td>
                <td className="px-4 py-2 whitespace-nowrap">{r.grade}</td>
                <td className="px-4 py-2 whitespace-nowrap">{r.max}</td>
              </tr>
            ))}

            {filteredAssignments.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 bg-white"
                >
                  No assignments for this course.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
