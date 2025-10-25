import type { ReactNode } from "react";

export default function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {(title || right || subtitle) && (
        <div className="px-4 pt-3 pb-2 flex items-baseline justify-between">
          <div>
            {title && <h3 className="text-sm font-medium text-slate-700">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className={(title || right || subtitle) ? "px-4 pb-4" : "p-4"}>{children}</div>
    </div>
  );
}
