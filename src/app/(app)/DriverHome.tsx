"use client";

import { useState } from "react";
import Link from "next/link";
import { useMode } from "@/lib/ModeContext";
import { Card } from "@/components/ui";
import { Menu, Bell, Flag, ListIcon, ChevronRight } from "@/components/Icons";
import { incomingRequests, driverToday, fmt } from "@/lib/data";

export default function DriverHome() {
  const { openDrawer } = useMode();
  const [online, setOnline] = useState(driverToday.online);
  const strikesLeft = driverToday.cancellationLimit - driverToday.cancellationsThisWeek;
  const pendingCount = incomingRequests.length;

  return (
    <div className="px-4">
      <header className="flex items-center justify-between gap-2 py-4">
        <button
          onClick={openDrawer}
          aria-label="Menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink"
        >
          <Menu size={20} />
        </button>
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-bad" />
        </Link>
      </header>

      <Card
        className={`flex items-center gap-3 px-4 py-4 ${
          online ? "border-good/20 bg-good-soft" : "border-line"
        }`}
      >
        <span className="flex-1">
          <span className="block text-[15px] font-bold">
            {online ? "You're Online" : "You're Offline"}
          </span>
          <span className="block text-[12.5px] text-sub">
            {online
              ? "Receiving nearby ride requests"
              : "Go online to start receiving requests"}
          </span>
        </span>
        <button
          role="switch"
          aria-checked={online}
          aria-label="Go online"
          onClick={() => setOnline((v) => !v)}
          className={`h-8 w-14 shrink-0 rounded-full p-1 transition-colors ${
            online ? "bg-good" : "bg-line"
          }`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${
              online ? "translate-x-6" : ""
            }`}
          />
        </button>
      </Card>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        <Card className="px-3 py-3 text-center">
          <div className="text-[16px] font-bold">{fmt(driverToday.earningsToday)}</div>
          <div className="text-[11px] text-sub">Today</div>
        </Card>
        <Card className="px-3 py-3 text-center">
          <div className="text-[16px] font-bold">{driverToday.tripsToday}</div>
          <div className="text-[11px] text-sub">Trips</div>
        </Card>
        <Card className="px-3 py-3 text-center">
          <div className="text-[16px] font-bold">{driverToday.hoursOnline}</div>
          <div className="text-[11px] text-sub">Online</div>
        </Card>
      </div>

      <Link
        href="/drive/requests"
        className={`mt-3 flex items-center gap-3 rounded-2xl px-4 py-4 shadow-sm ${
          online ? "bg-brand text-white" : "border border-line bg-white text-ink"
        }`}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            online ? "bg-white/20" : "bg-brand-soft text-brand"
          }`}
        >
          <ListIcon size={20} />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-bold">Ride Requests</span>
          <span className={`block text-[12.5px] ${online ? "text-white/80" : "text-sub"}`}>
            {online
              ? `${pendingCount} nearby — bid like an auction`
              : "Go online to see live requests"}
          </span>
        </span>
        {online && pendingCount > 0 && (
          <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-white px-1.5 text-[12px] font-bold text-brand">
            {pendingCount}
          </span>
        )}
        <ChevronRight size={18} className={online ? "text-white/70" : "text-faint"} />
      </Link>

      {driverToday.cancellationsThisWeek > 0 && (
        <Link
          href="/help"
          className="mt-3 flex items-center gap-3 rounded-2xl border border-warn/25 bg-warn-soft px-4 py-3"
        >
          <Flag size={16} className="shrink-0 text-warn" />
          <span className="flex-1 text-[12.5px] leading-snug text-ink">
            <span className="font-semibold">
              {driverToday.cancellationsThisWeek} of {driverToday.cancellationLimit}
            </span>{" "}
            cancellation strikes this week — only cancellations our fraud checks
            flag as suspicious count. {strikesLeft} more pauses your account;
            contact support if this looks wrong.
          </span>
        </Link>
      )}

      <Card className="mt-5 flex items-center gap-3 px-4 py-3.5">
        <span className="flex-1">
          <span className="block text-[13.5px] font-semibold">
            Peak hours right now
          </span>
          <span className="block text-[12px] text-sub">
            Demand is up in Avondale &amp; Borrowdale — stay online for more
            requests.
          </span>
        </span>
      </Card>
    </div>
  );
}
