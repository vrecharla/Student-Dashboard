import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import { getStudentId } from "../lib/auth";
import PageLoader from "../components/PageLoader";

export default function Profile() {
  const [data, setData] = useState<DashboardDTO | null>(null);

  useEffect(() => {
    const sId = getStudentId() || "S3001";
    getDashboard(sId, "Spring 2024").then(setData);
  }, []);

  if (!data) return <PageLoader />;

  const { student } = data;
  const dob = new Date(student.dob).toLocaleDateString();
  const phone = student.student_phone ?? "—";
  const emergency = student.emergency_contact ?? "—";

  return (
    <div className="space-y-10 px-6">

      {/* SECTION TITLE */}
      <div
        className="rounded-xl text-white text-left text-lg px-10 py-2 font-semibold"
        style={{
          backgroundColor: "var(--color-primary)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        Profile Overview
      </div>

      {/* PROFILE TABLE */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-background)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-left font-semibold text-l underline underline-offset-4"
            style={{
              backgroundColor: "var(--color-background)",
              color: "var(--color-primary)",
            }}>
              <th  className="px-6 py-2 whitespace-nowrap">Field</th>
              <th className="px-6 py-2 whitespace-nowrap">
                Value
              </th>
            </tr>
          </thead>

          <tbody>
            <tr><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>Full Name</td><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>{student.name}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap">Date of Birth</td><td className="px-6 py-2 whitespace-nowrap" >{dob}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>Phone Number</td><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>{phone}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap">Email</td><td className="px-6 py-2 whitespace-nowrap" >{student.mail_id}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>Student ID</td><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>{student.s_id}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap">Program</td><td className="px-6 py-2 whitespace-nowrap" >{student.program}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>Year</td><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }} >{student.level ?? "—"}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap">Advisor</td><td className="px-6 py-2 whitespace-nowrap" >Dr. Sarah Bennett</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>Enrollment Status</td><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }} >Active</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      {/* CONTACT DETAILS SECTION */}
      <div
        className="rounded-xl text-white text-left text-lg px-10 py-2 font-semibold"
        style={{
          backgroundColor: "var(--color-primary)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        Contact Details
      </div>

      {/* CONTACT TABLE */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-background)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div className="overflow-x-auto">
         <table className="min-w-full text-left">
          <thead>
            <tr className="text-left font-semibold text-l underline underline-offset-4"
            style={{
              backgroundColor: "var(--color-background)",
              color: "var(--color-primary)",
            }}>
              <th className="px-6 py-2 whitespace-nowrap">Field</th>
              <th className="px-6 py-2 whitespace-nowrap">
                Value
              </th>
            </tr>
          </thead>

          <tbody>
            <tr><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>Address</td><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }} >{student.address ?? "—"}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap">Emergency Contact</td><td  className="px-6 py-2 whitespace-nowrap">{emergency}</td></tr>
            <tr><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }}>Emergency Phone Number</td><td className="px-6 py-2 whitespace-nowrap" style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)" }} >{student.emergency_contact ?? "—"}</td></tr>
          </tbody>
        </table>
        </div>
      </div>

    </div>
  );
}
