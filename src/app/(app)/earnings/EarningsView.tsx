"use client";

import { useState } from "react";
import { Card, PrimaryButton } from "@/components/ui";
import { ChevronLeft, ChevronRight, TrendUp } from "@/components/Icons";
import { weeklyEarnings, fmt } from "@/lib/data";

const tabs = ["Daily", "Weekly", "Monthly"] as const;

export default function EarningsView() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Weekly");
  const w = weeklyEarnings;
  const max = Math.max(...w.days.map((d) => d.amount));

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

      <div className="mt-4 flex items-center justify-between">
        <button aria-label="Previous period" className="text-sub">
          <ChevronLeft size={20} />
        </button>
        <span className="text-[14px] font-semibold">{w.range}</span>
        <button aria-label="Next period" className="text-sub">
          <ChevronRight size={20} />
        </button>
      </div>

      <Card className="mt-3.5 px-4 py-4">
        <div className="text-[13px] text-sub">Total Earnings</div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[28px] font-bold leading-tight">
            {fmt(w.total)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-good-soft px-2 py-0.5 text-[12px] font-bold text-good">
            <TrendUp size={12} /> {w.changePct}%
          </span>
        </div>
        <div className="text-[12px] text-sub">vs {w.prevRange}</div>

        <div className="mt-4 flex h-32 items-end justify-between gap-2">
          {w.days.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className="w-4 rounded-md bg-good-bright"
                style={{ height: `${Math.max((d.amount / max) * 104, 6)}px` }}
              />
              <span className="text-[10.5px] text-faint">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-3 flex divide-x divide-line py-3.5 text-center">
        <div className="flex-1">
          <div className="text-[12px] text-sub">Trips</div>
          <div className="text-[15.5px] font-bold">{w.trips}</div>
        </div>
        <div className="flex-1">
          <div className="text-[12px] text-sub">Online</div>
          <div className="text-[15.5px] font-bold">{w.online}</div>
        </div>
        <div className="flex-1">
          <div className="text-[12px] text-sub">Avg/Trip</div>
          <div className="text-[15.5px] font-bold">{fmt(w.avgPerTrip)}</div>
        </div>
      </Card>

      <Card className="mt-3 px-4 py-4">
        <div className="text-[14.5px] font-semibold">Breakdown</div>
        <div className="mt-3 space-y-2.5 text-[13.5px]">
          {[
            { label: "Trip Earnings", value: w.breakdown.tripEarnings, dot: "bg-good" },
            { label: "Incentives", value: w.breakdown.incentives, dot: "bg-brand" },
            { label: "Other Earnings", value: w.breakdown.other, dot: "bg-amber-400" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${row.dot}`} />
              <span className="flex-1 text-sub">{row.label}</span>
              <span className="font-semibold">{fmt(row.value)}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-transparent" />
            <span className="flex-1 text-sub">Deductions</span>
            <span className="font-semibold text-bad">
              -{fmt(Math.abs(w.breakdown.deductions))}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[14.5px] font-semibold">Payout</span>
          <span className="text-[16px] font-bold">
            {fmt(w.breakdown.payout)}
          </span>
        </div>
      </Card>

      <PrimaryButton href="/wallet" className="mt-4">
        View Earnings History
      </PrimaryButton>
    </div>
  );
}
