"use client";

import { useState } from "react";
import { Card, Divider } from "@/components/ui";
import { CheckCircle, Trophy, Doc, Car } from "@/components/Icons";
import { notifications } from "@/lib/data";

const tabs = ["All", "Trips", "Promotions", "Alerts"] as const;

type NotificationItem = {
  title: string;
  body: string;
  time: string;
  tone: string;
  category: string;
  unread: boolean;
};

const toneStyle = {
  good: "bg-good-soft text-good",
  brand: "bg-brand-soft text-brand",
  warn: "bg-warn-soft text-warn",
} as const;

const categoryIcon = {
  Trips: Car,
  Promotions: Trophy,
  Alerts: Doc,
} as const;

export default function NotificationsView() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [items, setItems] = useState<NotificationItem[]>(() =>
    notifications.map((n) => ({ ...n }))
  );

  const filtered = items.filter((n) => tab === "All" || n.category === tab);

  return (
    <div className="px-4 pb-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full border-2 px-3.5 py-1.5 text-[13px] font-semibold ${
              tab === t
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-white text-sub"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="mt-3.5">
        {filtered.map((n, i) => {
          const Icon = categoryIcon[n.category as keyof typeof categoryIcon] ?? CheckCircle;
          return (
            <div key={n.title + n.time}>
              {i > 0 && <Divider />}
              <div className="flex gap-3 px-4 py-3.5">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    toneStyle[n.tone as keyof typeof toneStyle]
                  }`}
                >
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[14px] ${n.unread ? "font-bold" : "font-medium"}`}
                    >
                      {n.title}
                    </span>
                    <span className="shrink-0 text-[11.5px] text-faint">{n.time}</span>
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-sub">
                    {n.body}
                  </span>
                </span>
                {n.unread && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-[13.5px] text-sub">
            Nothing here yet.
          </p>
        )}
      </Card>

      <button
        onClick={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
        className="mt-4 w-full text-center text-[13.5px] font-semibold text-brand"
      >
        Mark all as read
      </button>
    </div>
  );
}
