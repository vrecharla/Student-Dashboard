// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import illustration from "../assets/illustration.png";

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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* Left side - Login form */}
      <div
        className="flex flex-col justify-center px-10 md:px-20"
        style={{ backgroundColor: "#000", color: "#fff" }}
      >
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-4xl font-extrabold mb-2">Login</h1>
          <p className="text-slate-400 mb-10">Enter your account details</p>

          {err && <p className="text-sm text-rose-500 mb-3">{err}</p>}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm mb-1 text-slate-300">
                Student ID
              </label>
              <input
                className="w-full bg-transparent border-b border-slate-600 focus:outline-none focus:border-[var(--color-primary)] text-white py-2"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-transparent border-b border-slate-600 focus:outline-none focus:border-[var(--color-primary)] text-white py-2"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white py-2.5 rounded-md font-medium mt-6 transition-all"
              style={{
                backgroundColor: "var(--color-primary)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Welcome panel */}
      <div
        className="hidden md:flex justify-center items-center relative"
        style={{ backgroundColor: "var(--color-primary)" }}
      >

        {/* Foreground content box */}
        <div
          className="absolute z-10 w-[80%] h-[85%] left-0 rounded-lg flex flex-col justify-center text-white text-left p-14"
          style={{
            backgroundColor: "var(--color-primary)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="max-w-md">
            <h2 className="text-lg font-medium opacity-90">Welcome To,</h2>
            <h1 className="text-4xl font-extrabold mt-1 leading-snug">
              Student Dashboard Portal
            </h1>

            <img
              src={illustration}
              alt="Students Illustration"
              className="mt-12 w-120"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
