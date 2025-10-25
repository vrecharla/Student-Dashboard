import type { ReactNode } from "react";

export default function Card({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      {title && <p className="text-sm text-gray-500">{title}</p>}
      <div className={title ? "mt-2" : ""}>{children}</div>
    </div>
  );
}

