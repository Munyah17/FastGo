"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Briefcase, Bike, Info, Wallet, ChevronRight } from "@/components/Icons";
import { Card } from "@/components/ui";
import { rideOptions, user, fmt } from "@/lib/data";

const optionIcons = {
  ordinary: Car,
  four_seater: Car,
  seven_seater: Car,
  comfort: Car,
  luxury: Car,
  exclusive: Car,
  delivery: Briefcase,
  bike: Bike,
} as const;

export default function RideOptions() {
  const [selected, setSelected] = useState("ordinary");

  return (
    <div className="px-4 pb-6">
      <div className="mt-3 space-y-2.5">
        {rideOptions.map((opt) => {
          const active = opt.id === selected;
          const Icon = optionIcons[opt.id as keyof typeof optionIcons];
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-left transition-colors ${
                active ? "border-brand" : "border-line"
              }`}
            >
              <span className="flex h-10 w-14 items-center justify-center rounded-xl bg-page text-sub">
                <Icon size={24} />
              </span>
              <span className="flex-1">
                <span className="block text-[14.5px] font-semibold">
                  {opt.name}
                </span>
                <span className="block text-[12.5px] text-sub">
                  {opt.eta}
                  {opt.seats > 0 ? ` • ${opt.seats} seats` : " • Parcels only"}
                </span>
              </span>
              <span className="text-[15px] font-bold">{fmt(opt.price)}</span>
              <Info size={15} className="text-faint" />
            </button>
          );
        })}
      </div>

      <Card className="mt-3 flex items-center gap-3 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-good-soft text-good">
          <Wallet size={17} />
        </span>
        <span className="flex-1">
          <span className="block text-[11.5px] uppercase tracking-wide text-faint">
            Payment
          </span>
          <span className="block text-[14px] font-medium">FastGo Wallet</span>
        </span>
        <span className="text-[14px] font-semibold">
          {fmt(user.walletBalance)}
        </span>
        <ChevronRight size={17} className="text-faint" />
      </Card>

      <Link
        href="/searching"
        className="mt-4 block w-full rounded-xl bg-brand py-3.5 text-center font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Confirm Ride
        <span className="block text-[11.5px] font-normal text-white/75">
          Fast &amp; Secure
        </span>
      </Link>
    </div>
  );
}
