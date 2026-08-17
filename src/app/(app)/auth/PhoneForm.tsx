"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PhoneForm() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const valid = phone.replace(/\D/g, "").length >= 9;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) router.push("/auth/verify");
      }}
      className="mt-6"
    >
      <label className="text-[13px] font-semibold text-sub">
        Phone Number
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3.5 focus-within:border-brand">
        <span className="flex items-center gap-1.5 border-r border-line pr-3 text-[14.5px] font-semibold">
          🇿🇼 +263
        </span>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="77 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-faint"
          aria-label="Phone number"
        />
      </div>

      <button
        type="submit"
        disabled={!valid}
        className="mt-5 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white transition-opacity hover:bg-brand-dark disabled:opacity-40"
      >
        Continue
      </button>

      <p className="mt-4 text-center text-[12px] leading-relaxed text-faint">
        By continuing you agree to FastGo&apos;s{" "}
        <span className="font-semibold text-sub">Terms of Service</span> and{" "}
        <span className="font-semibold text-sub">Privacy Policy</span>.
      </p>
    </form>
  );
}
