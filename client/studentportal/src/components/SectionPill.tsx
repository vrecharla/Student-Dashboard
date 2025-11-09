// src/components/SectionPill.tsx
export default function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-2 rounded-full bg-purple-700 text-white text-sm font-semibold shadow-[0_12px_28px_-14px_rgba(107,33,168,0.55)] w-max mx-auto">
      {children}
    </div>
  );
}
