// src/pages/Finance.tsx
import { useEffect, useState } from "react";
import type { DashboardDTO } from "../types/dashboard";
import { getDashboard } from "../api/client";
import { getStudentId } from "../lib/auth";
// Uses financeSummary from the dashboard payload
import PageLoader from "../components/PageLoader";

function fmt(n: number) { return `$ ${Number(n).toLocaleString()}`; }

export default function Finance() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { const sId = getStudentId() || "S3001"; getDashboard(sId, "Spring 2024").then(setData).catch((e) => setErr(String(e))); }, []);
  if (err) return <div className="p-6 text-red-600">Could not load Finance: {err}</div>;
  if (!data) return <PageLoader />;

  // Use financeSummary from the backend when available
  const total = data.financeSummary?.total_amount ?? 0;
  const bal = data.financeSummary?.balance_due ?? 0;
  const paid = Math.max(0, total - bal);

  const rows = [
    {
      term: "Current",
      fees: total,
      due: data.financeSummary?.next_due_date ? new Date(data.financeSummary.next_due_date).toLocaleDateString() : "—",
      status: bal > 0 ? "Pending" : "Paid",
    },
  ];

  return (
    <div className="space-y-10 px-6">

      <div
        className="rounded-xl text-white text-left text-xl px-10 py-2 font-bold"
        style={{
        backgroundColor: "var(--color-primary)",
        boxShadow: "var(--shadow-soft)",
      }}
      >
        Financial Overview
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-md"
          style={{
            boxShadow: "var(--shadow-soft)",
          }}>
          <div className="text-md font-medium mb-2 border-b-4 border-[var(--color-primary)] inline-block pr-8">
            Total Fees
          </div>
          <p className="text-3xl font-bold mt-2">{fmt(total)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md"
          style={{
            boxShadow: "var(--shadow-soft)",
          }}>
          <div className="text-md font-medium mb-2 border-b-4 border-[var(--color-success)] inline-block pr-8">
           Fees Paid
          </div>
          <p className="text-3xl font-bold mt-2">{fmt(paid)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md"
          style={{
            boxShadow: "var(--shadow-soft)",
          }}>
          <div className="text-md font-medium mb-2 border-b-4 border-[var(--color-danger)] inline-block pr-8">
            Balance
          </div>
          <p className="text-3xl font-bold mt-2">{fmt(bal)}</p>
        </div>
      </section>

      <div
        className="rounded-xl text-white text-left text-xl px-10 py-2 font-bold"
        style={{
        backgroundColor: "var(--color-primary)",
        boxShadow: "var(--shadow-soft)",
      }}
      >
        Payment details
      </div>

      <div className="mt-2 rounded-xl overflow-hidden"
        style={{
          boxShadow: "var(--shadow-soft)",
        }}>
        <table className="px-2 w-full">
          <thead>
            <tr className="text-left font-semibold text-l underline underline-offset-4"
            style={{
              backgroundColor: "var(--color-background)",
              color: "var(--color-primary)",
            }}
            >
              <th className="px-6 py-2">Term</th>
              <th>Fees</th> 
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                style={{
                    backgroundColor: i % 2 ? "var(--color-background)" : "rgba(var(--color-primary-rgb), 0.08)"
                  }}
              >
                <td className="px-6 py-2">{r.term}</td>
                <td>{fmt(r.fees)}</td>
                <td>{r.due}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
