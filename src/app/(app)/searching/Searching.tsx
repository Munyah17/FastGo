"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MapMock from "@/components/MapMock";
import { Card } from "@/components/ui";
import { Car, Star, CheckCircle } from "@/components/Icons";
import { driverOffers, fmt } from "@/lib/data";

export default function Searching() {
  const router = useRouter();
  const [visibleOffers, setVisibleOffers] = useState<typeof driverOffers[number][]>([]);
  const [declined, setDeclined] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timers = driverOffers.map((o) =>
      setTimeout(() => setVisibleOffers((v) => [...v, o]), o.delayMs)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const shown = visibleOffers.filter((o) => !declined.has(o.id));

  const accept = (offerId: string) => {
    router.push(`/ride?offer=${offerId}`);
  };

  const decline = (offerId: string) => {
    setDeclined((d) => new Set(d).add(offerId));
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative h-[38vh] min-h-[220px] shrink-0">
        <MapMock className="h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
            <span className="absolute inset-3 animate-pulse rounded-full bg-brand/25" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg">
              <Car size={22} />
            </span>
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        <div className="text-center">
          <div className="text-[16px] font-bold">
            {shown.length === 0
              ? "Broadcasting your offer to nearby drivers…"
              : `${shown.length} driver${shown.length > 1 ? "s" : ""} responded`}
          </div>
          <p className="mt-1 text-[13px] text-sub">
            Pick a driver, or wait for more offers to arrive.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {shown.map((o) => (
            <Card key={o.id} className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[14px] font-bold text-brand">
                  {o.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[14px] font-semibold">
                    {o.name}
                    <Star size={12} className="text-amber-400" />
                    <span className="text-[12px] font-medium text-sub">{o.rating}</span>
                  </span>
                  <span className="block truncate text-[12px] text-sub">{o.vehicle}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[15px] font-bold">{fmt(o.fare)}</span>
                  <span className="block text-[11.5px] text-sub">{o.etaMin} min away</span>
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => accept(o.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-[13px] font-bold text-white hover:bg-brand-dark"
                >
                  <CheckCircle size={15} /> Choose {o.name.split(" ")[0]}
                </button>
                <button
                  onClick={() => decline(o.id)}
                  className="rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-faint"
                >
                  Decline
                </button>
              </div>
            </Card>
          ))}

          {shown.length === 0 && (
            <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-line">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-brand" />
            </div>
          )}
        </div>

        <Link
          href="/book"
          className="mt-6 block text-center text-[13.5px] font-semibold text-bad"
        >
          Cancel Request
        </Link>
      </div>
    </div>
  );
}
