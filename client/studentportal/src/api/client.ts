import type { DashboardDTO } from "../types/dashboard";
import { demoDashboard } from "../lib/demoData";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getDashboard(studentId: string, term?: string): Promise<DashboardDTO> {
  try {
    const url = new URL(`${BASE}/dashboard/${studentId}`);
    if (term) url.searchParams.set("term", term);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  } catch {
    // fallback while API is not ready
    return demoDashboard;
  }
}
