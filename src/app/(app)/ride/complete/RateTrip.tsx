"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "@/components/Icons";
import { Card } from "@/components/ui";
import { fmt } from "@/lib/data";

const tips = [0, 0.5, 1, 2];

export default function RateTrip() {
  const [stars, setStars] = useState(0);
  const [tip, setTip] = useState(0);

  return (
    <div className="px-4 pb-8">
      <Card className="mt-4 px-4 py-5 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-[17px] font-bold text-brand">
          BM
        </span>
        <div className="mt-2 text-[15.5px] font-bold">
          How was your trip with Blessing?
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setStars(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className={n <= stars ? "text-amber-400" : "text-line"}
            >
              <Star size={32} />
            </button>
          ))}
        </div>
        {stars > 0 && (
          <p className="mt-2 text-[13px] font-medium text-good">
            {stars === 5
              ? "Excellent! Blessing will appreciate that."
              : stars >= 4
                ? "Great — thanks for the feedback."
                : "Sorry to hear that. We'll follow up."}
          </p>
        )}
      </Card>

      <Card className="mt-3.5 px-4 py-4">
        <div className="text-[14.5px] font-semibold">Add a tip?</div>
        <p className="text-[12.5px] text-sub">100% goes to your driver.</p>
        <div className="mt-3 flex gap-2">
          {tips.map((t) => (
            <button
              key={t}
              onClick={() => setTip(t)}
              className={`flex-1 rounded-xl border-2 py-2.5 text-[13.5px] font-semibold ${
                tip === t
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line bg-white text-sub"
              }`}
            >
              {t === 0 ? "No tip" : fmt(t)}
            </button>
          ))}
        </div>
      </Card>

      <Link
        href="/"
        className="mt-5 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
      >
        {tip > 0 ? `Submit & Tip ${fmt(tip)}` : "Submit"}
      </Link>
      <Link
        href="/trips"
        className="mt-3 block text-center text-[13.5px] font-semibold text-sub"
      >
        View Receipt
      </Link>
    </div>
  );
}
