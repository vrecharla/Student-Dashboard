// src/components/Card.tsx
import type { ReactNode } from "react";

export default function Card({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] p-5">
      {title && <p className="text-sm font-semibold text-slate-700">{title}</p>}
      <div className={title ? "mt-3" : ""}>{children}</div>
    </div>
  );
}
