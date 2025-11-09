// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import Card from "../components/Card";

export default function Profile() {
  const [data, setData] = useState<DashboardDTO | null>(null);

  useEffect(() => { getDashboard("S001", "Spring 2024").then(setData); }, []);
  if (!data) return <div className="p-6">Loading…</div>;

  const { student } = data;

  // helpers
  const dob = new Date(student.dob).toLocaleDateString();
  const phone = student.student_phone ?? "—";
  const emergency = student.emergency_contact ?? "—";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* banner */}
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

        {/* Personal Information */}
        <Card title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Full Name</p>
              <p className="font-medium">{student.name}</p>
            </div>
            <div>
              <p className="text-slate-500">Date of Birth</p>
              <p className="font-medium">{dob}</p>
            </div>
            <div>
              <p className="text-slate-500">Gender</p>
              <p className="font-medium">{student.gender}</p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-medium">{student.status}</p>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Email Address</p>
              <p className="font-medium">{student.mail_id}</p>
            </div>
            <div>
              <p className="text-slate-500">Phone Number</p>
              <p className="font-medium">{phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-500">Emergency Contact</p>
              <p className="font-medium">{emergency}</p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
