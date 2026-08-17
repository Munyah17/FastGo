"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/ui";
import { Trophy, Star } from "@/components/Icons";
import { weeklyChallenge, incentives, incentiveHistory, fmt } from "@/lib/data";

const tabs = ["Active", "History"] as const;
const toneStyle = {
  warn: "bg-warn-soft text-warn",
  brand: "bg-brand-soft text-brand",
  good: "bg-good-soft text-good",
} as const;

export default function IncentivesView() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Active");
  const pct = Math.round((weeklyChallenge.progress / weeklyChallenge.total) * 100);

  return (
    <div className="px-4 pb-6">
      <div className="rounded-2xl bg-brand px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] text-white/70">{weeklyChallenge.title}</div>
            <div className="text-[16px] font-bold">{weeklyChallenge.desc}</div>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <Trophy size={22} />
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[12.5px] font-semibold">
          <span>
            {weeklyChallenge.progress} / {weeklyChallenge.total}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-4 flex rounded-xl bg-white p-1 shadow-sm">
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

      {tab === "Active" ? (
        <div className="mt-3.5 space-y-3">
          {incentives.map((inc) => (
            <Card key={inc.title} className="flex items-center gap-3 px-4 py-3.5">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  toneStyle[inc.tone as keyof typeof toneStyle]
                }`}
              >
                <Trophy size={18} />
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-semibold">{inc.title}</span>
                <span className="block text-[12.5px] text-sub">{inc.desc}</span>
              </span>
              <Badge tone={inc.tone === "warn" ? "warn" : inc.tone === "good" ? "good" : "brand"}>
                {inc.reward}
              </Badge>
            </Card>
          ))}
          <button className="w-full py-2 text-center text-[13.5px] font-semibold text-brand">
            View All Incentives
          </button>
        </div>
      ) : (
        <div className="mt-3.5 space-y-3">
          {incentiveHistory.map((h) => (
            <Card key={h.title} className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-good-soft text-good">
                <Star size={17} />
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-semibold">{h.title}</span>
                <span className="block text-[12.5px] text-sub">{h.desc}</span>
              </span>
              <span className="text-right">
                <span className="block text-[13.5px] font-bold text-good">
                  +{fmt(h.reward)}
                </span>
                <span className="block text-[11px] text-faint">{h.date}</span>
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
