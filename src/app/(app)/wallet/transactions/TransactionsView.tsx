"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import {
  CheckCircle,
  Dollar,
  Shield,
  Upload,
  Download,
  Trophy,
} from "@/components/Icons";
import { transactions, fmt } from "@/lib/data";

const tabs = ["All", "Credits", "Debits"] as const;

const typeStyle = {
  ride_payment: { icon: CheckCircle, bg: "bg-good-soft text-good" },
  topup: { icon: Upload, bg: "bg-brand-soft text-brand" },
  withdraw: { icon: Download, bg: "bg-page text-sub" },
  commission: { icon: Dollar, bg: "bg-bad-soft text-bad" },
  protection: { icon: Shield, bg: "bg-warn-soft text-warn" },
  bonus: { icon: Trophy, bg: "bg-warn-soft text-warn" },
} as const;

export default function TransactionsView() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const filtered = transactions.filter((t) => {
    if (tab === "Credits") return t.amount > 0;
    if (tab === "Debits") return t.amount < 0;
    return true;
  });

  const groups = filtered.reduce<Record<string, typeof transactions[number][]>>(
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

      {Object.entries(groups).map(([day, items]) => (
        <div key={day} className="mt-4">
          <div className="mb-2 text-[13px] font-semibold text-sub">{day}</div>
          <Card>
            {items.map((t, i) => {
              const s = typeStyle[t.type as keyof typeof typeStyle];
              const Icon = s.icon;
              return (
                <div key={t.id}>
                  {i > 0 && <div className="mx-4 h-px bg-line" />}
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${s.bg}`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium">
                        {t.label}
                      </span>
                      <span className="block text-[12px] text-sub">{t.time}</span>
                    </span>
                    <span className="text-right">
                      <span
                        className={`block text-[14px] font-bold ${
                          t.amount > 0 ? "text-good" : "text-ink"
                        }`}
                      >
                        {t.amount > 0 ? "+" : "-"}
                        {fmt(Math.abs(t.amount))}
                      </span>
                      <span className="block text-[11px] text-faint">
                        {t.channel}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}
