import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import illustration from "../assets/illustration.png";
import { setAuth } from "../lib/auth";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: id, password: pwd }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `status ${res.status}`);
      }
      const body = await res.json();
      setAuth(body.access_token, body.student);
      onLogin(); // update auth state in App
      nav("/", { replace: true });
    } catch (err) {
      setErr(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <div className="flex flex-col justify-center px-10 md:px-20" style={{ backgroundColor: "#000", color: "#fff" }}>
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-4xl font-extrabold mb-2">Login</h1>
          <p className="text-slate-400 mb-10">Enter your account details</p>
          {err && <p className="text-sm text-rose-500 mb-3">{err}</p>}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm mb-1 text-slate-300">Student ID</label>
              <input
                className={`w-full bg-transparent border-b border-slate-600 focus:outline-none focus:border-[var(--color-primary)] text-white px-3 py-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                value={id} onChange={(e) => setId(e.target.value)} disabled={loading} />
            </div>

            <div>
              <label className="block text-sm mb-1 text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className={`w-full bg-transparent border-b border-slate-600 focus:outline-none focus:border-[var(--color-primary)] text-white px-3 py-2 pr-10 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                  value={pwd} onChange={(e) => setPwd(e.target.value)} disabled={loading} />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute py-3 px-2 right-0 top-1/2 -translate-y-1/2 text-slate-200 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  title={showPwd ? "Hide password" : "Show password"}
                  style={{ backgroundColor: "var(--color-primary)" }}
                  disabled={loading}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white py-2.5 rounded-md font-medium mt-6 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-primary)", boxShadow: "var(--shadow-soft)" }}
              disabled={loading}
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex justify-center items-center relative" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="absolute z-10 w-[80%] h-[85%] left-0 rounded-lg flex flex-col justify-center text-white text-left p-14" style={{ backgroundColor: "var(--color-primary)", boxShadow: "var(--shadow-soft)" }}>
          <div className="max-w-md">
            <h2 className="text-lg font-medium opacity-90">Welcome To,</h2>
            <h1 className="text-4xl font-extrabold mt-1 leading-snug">Student Dashboard Portal</h1>
            <img src={illustration} alt="Students Illustration" className="mt-12 w-120" />
          </div>
        </div>
      </div>
    </div>
  );
}
