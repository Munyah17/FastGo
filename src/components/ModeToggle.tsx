"use client";

import { useMode } from "@/lib/ModeContext";

export default function ModeToggle({ className = "" }: { className?: string }) {
  const { mode, setMode } = useMode();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-white p-1 shadow-lg ${className}`}
      role="tablist"
      aria-label="Switch between passenger and driver mode"
    >
      {(["passenger", "driver"] as const).map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={mode === m}
          onClick={() => setMode(m)}
          className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-colors ${
            mode === m ? "bg-brand text-white" : "text-sub"
          }`}
        >
          {m === "passenger" ? "Ride" : "Drive"}
        </button>
      ))}
    </div>
  );
}
