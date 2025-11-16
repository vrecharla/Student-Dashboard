import type { DashboardDTO } from "../types/dashboard";
import { getToken } from "../lib/auth";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function buildDashboardUrl(studentId: string, term?: string) {
  const path = `/dashboard/${encodeURIComponent(studentId)}`;
  try {
    // If BASE is absolute, use it as the URL base. If it's relative (e.g. "/api"), fall back
    // to using the current origin so the URL constructor works in the browser.
    const baseIsAbsolute = /^https?:\/\//i.test(String(BASE));
    const base = baseIsAbsolute
      ? String(BASE)
      : (typeof window !== "undefined" ? window.location.origin + String(BASE) : String(BASE));
    const url = new URL(path, base);
    if (term) url.searchParams.set("term", term);
    return url.toString();
  } catch {
    // Last-resort string concat (keeps behavior but is less strict)
    const b = String(BASE).replace(/\/$/, "");
    return `${b}${path}${term ? `?term=${encodeURIComponent(term)}` : ""}`;
  }
}

export async function getDashboard(studentId: string, term?: string): Promise<DashboardDTO> {
  try {
    const url = buildDashboardUrl(studentId, term);
    const headers: Record<string, string> = { Accept: "application/json" };
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`API responded with status ${res.status}`);
    // await the JSON so any parse errors are caught here and trigger the fallback
    const data = await res.json();
    return data as DashboardDTO;
  } catch (err) {
    // Surface the error to callers (no demo fallback)
    // eslint-disable-next-line no-console
    console.error("getDashboard failed:", err);
    throw err;
  }
}
