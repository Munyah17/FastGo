"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { tripHistory, fmt } from "@/lib/data";

const tabs = ["All", "Completed", "Cancelled"] as const;

const paymentTone: Record<string, string> = {
  Cash: "bg-page text-sub",
  EcoCash: "bg-brand-soft text-brand",
  Wallet: "bg-good-soft text-good",
  "—": "bg-bad-soft text-bad",
};

export default function TripHistoryView() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const filtered = tripHistory.filter((t) =>
    tab === "All" ? true : t.status === tab
  );

  const groups = filtered.reduce<Record<string, typeof tripHistory[number][]>>(
    (acc, t) => {
      (acc[t.day] ??= []).push(t);
      return acc;
    },
    {}
  );

  return (
    <div className="px-4 pb-6">
      <div className="flex rounded-xl bg-white p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-[13.5px] font-semibold transition-colors ${
              tab === t ? "bg-brand text-white" : "text-sub"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {Object.keys(groups).length === 0 && (
        <p className="mt-8 text-center text-[13.5px] text-sub">
          No {tab.toLowerCase()} trips yet.
        </p>
      )}

      {Object.entries(groups).map(([day, items]) => (
        <div key={day} className="mt-4">
          <div className="mb-2 text-[13px] font-semibold text-sub">{day}</div>
          <Card>
            {items.map((t, i) => (
              <div key={t.id}>
                {i > 0 && <div className="mx-4 h-px bg-line" />}
                <Link
                  href={`/trips/detail?id=${t.id}`}
                  className="flex items-start gap-3 px-4 py-3.5 hover:bg-page/60"
                >
                  <div className="flex flex-col items-center gap-1 pt-1.5">
                    <span className="h-2 w-2 rounded-full bg-good" />
                    <span className="h-6 w-px border-l border-dashed border-line" />
                    <span className="h-2 w-2 rounded-full bg-bad" />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[11.5px] text-faint">{t.time}</span>
                      {t.status === "Completed" && (
                        <span className="text-[14px] font-bold">
                          {fmt(t.fare)}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[14px] font-semibold">
                      {t.to}
                    </span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="block truncate text-[12.5px] text-sub">
                        {t.from}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                          paymentTone[t.payment] ?? "bg-page text-sub"
                        }`}
                      >
                        {t.status === "Cancelled" ? "Cancelled" : t.payment}
                      </span>
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}
