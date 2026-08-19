"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMode } from "@/lib/ModeContext";
import { useCity } from "@/lib/CityContext";
import { Card } from "@/components/ui";
import { Menu, Bell, ListIcon, ChevronRight, Loader2, Navigation } from "@/components/Icons";
import { incomingRequests } from "@/lib/data";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-page text-faint">
      <Loader2 size={18} className="animate-spin" />
    </div>
  ),
});

export default function DriverHome() {
  const { openDrawer, online } = useMode();
  const { city } = useCity();
  const pendingCount = incomingRequests.length;

  return (
    <div>
      <div className="relative h-[54vh] min-h-[360px] overflow-hidden">
        <LiveMap
          className="h-full w-full"
          center={city.center}
          zoom={14}
          interactive={false}
          markers={[{ position: city.center, kind: "vehicle" }]}
        />

        <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between gap-2">
          <button
            onClick={openDrawer}
            aria-label="Menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg"
          >
            <Menu size={20} />
          </button>
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-bad" />
          </Link>
        </div>

        <span className="pointer-events-none absolute left-3 top-[70px] z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold shadow-lg">
          <Navigation size={12} className="text-brand" /> Your Location
        </span>
      </div>

      <div className="relative rounded-t-3xl bg-page px-4 pb-4 pt-5 shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.15)]">
        <Link
          href="/drive/requests"
          className={`flex items-center gap-3 rounded-2xl px-4 py-4 shadow-sm ${
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
                ? `${pendingCount} nearby, bid like an auction`
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

        <Card className="mt-3.5 flex items-center gap-3 px-4 py-3.5">
          <span className="flex-1">
            <span className="block text-[13.5px] font-semibold">
              Peak hours right now
            </span>
            <span className="block text-[12px] text-sub">
              Demand is up in Avondale &amp; Borrowdale. Stay online for more
              requests.
            </span>
          </span>
        </Card>
      </div>
    </div>
  );
}
