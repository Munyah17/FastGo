"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";

const categories = [
  "Safety concern",
  "Driver behaviour",
  "Passenger behaviour",
  "Vehicle condition",
  "Accident",
  "Lost item",
  "Other",
];

export default function ReportForm() {
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="px-4 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-[28px]">
          ✓
        </div>
        <h2 className="mt-3 text-[19px] font-bold">Report Submitted</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-sub">
          Reference <span className="font-bold text-ink">IR-20250518-042</span>.
          Our safety team will contact you within 24 hours. For emergencies,
          always use SOS.
        </p>
        <Link
          href="/safety"
          className="mt-6 block w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Back to Safety Center
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pb-8">
      <div className="mb-2 text-[13px] font-semibold text-sub">
        What happened?
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-[13px] font-semibold ${
              category === c
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-white text-sub"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">
        Related trip
      </div>
      <Card className="px-4 py-3">
        <div className="text-[13.5px] font-medium">
          FG-88214 — Sam Levy&apos;s Village
        </div>
        <div className="text-[12px] text-sub">Today, 08:42 • Blessing M.</div>
      </Card>

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">
        Details
      </div>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={5}
        placeholder="Describe what happened…"
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-[14px] outline-none placeholder:text-faint focus:border-brand"
      />

      <button
        onClick={() => category && setDone(true)}
        disabled={!category}
        className="mt-5 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-40"
      >
        Submit Report
      </button>
      <p className="mt-3 text-center text-[12px] text-faint">
        In an emergency, use the SOS button — it alerts your contacts and our
        24/7 safety line immediately.
      </p>
    </div>
  );
}
