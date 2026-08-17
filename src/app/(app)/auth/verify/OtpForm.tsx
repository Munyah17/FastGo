"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function OtpForm() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const complete = digits.every((d) => d !== "");

  const set = (i: number, v: string) => {
    const c = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = c;
    setDigits(next);
    if (c && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i] && i > 0)
                refs.current[i - 1]?.focus();
            }}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            className="h-14 w-12 rounded-xl border border-line bg-white text-center text-[20px] font-bold outline-none focus:border-brand"
          />
        ))}
      </div>

      <button
        onClick={() => complete && router.push("/")}
        disabled={!complete}
        className="mt-6 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-40"
      >
        Verify &amp; Continue
      </button>

      <p className="mt-4 text-center text-[13px] text-sub">
        Didn&apos;t receive a code?{" "}
        <button className="font-semibold text-brand">Resend in 0:28</button>
      </p>
    </div>
  );
}
