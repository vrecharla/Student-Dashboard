// src/pages/Finance.tsx
import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import SectionPill from "../components/SectionPill";
import Card from "../components/Card";
import KPI from "../components/KPI";

function fmt(n: number) { return `$ ${Number(n).toLocaleString()}`; }

export default function Finance() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  useEffect(() => { getDashboard("S001", "Spring 2024").then(setData); }, []);
  if (!data) return <div className="p-6">Loading…</div>;

  const total = 10000, paid = 8000, bal = total - paid;
  const rows = [
    { term: "Fall 2024",   fees: total, due: "November 15th 2025", status: "Pending" },
    { term: "Spring 2024", fees: total, due: "March 25th 2025",    status: "Paid" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="grid place-items-center"><SectionPill>STUDENT DASHBOARD PORTAL</SectionPill></div>

        <div className="h-10 rounded-full bg-purple-700 text-white font-semibold grid place-items-center shadow-[0_12px_28px_-14px_rgba(107,33,168,0.55)] w-full max-w-sm mx-auto">
          Financial Overview
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <KPI label="Total Fees" value={fmt(total)} />
          <KPI label="Fees Paid"  value={fmt(paid)} />
          <KPI label="Balance"    value={fmt(bal)} />
        </section>

        <Card title="Payment Details">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-2">Term</th>
                <th>Fees</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={["border-t", i % 2 ? "bg-slate-50/60" : ""].join(" ")}>
                  <td className="py-2">{r.term}</td>
                  <td>{fmt(r.fees)}</td>
                  <td>{r.due}</td>
                  <td className={r.status === "Pending" ? "text-amber-600 font-medium" : ""}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
