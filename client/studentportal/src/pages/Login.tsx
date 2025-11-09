// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (id === "S001" && pwd === "hsu") nav("/");
    else setErr("Incorrect credentials");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow p-6">
        <h1 className="text-lg font-semibold">Welcome To,</h1>
        <h2 className="text-xl font-bold mt-1">Student Dashboard Portal</h2>

        <p className="text-sm text-slate-600 mt-4">Login</p>
        <p className="text-xs text-slate-500 mb-4">Enter your account details</p>

        {err && <p className="text-sm text-rose-600 mb-2">{err}</p>}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-600">Student ID</label>
            <input className="w-full border rounded-md px-3 py-2" value={id} onChange={e=>setId(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-600">Password</label>
            <input type="password" className="w-full border rounded-md px-3 py-2" value={pwd} onChange={e=>setPwd(e.target.value)} />
          </div>
          <button className="w-full mt-2 rounded-md bg-purple-700 text-white py-2 font-medium">Login</button>
        </form>
      </div>
    </div>
  );
}
