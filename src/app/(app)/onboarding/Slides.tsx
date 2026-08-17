"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, ShieldCheck, Wallet } from "@/components/Icons";

const slides = [
  {
    icon: Car,
    title: "Rides in seconds",
    body: "Set your destination, see the price upfront and get matched with a verified driver near you.",
  },
  {
    icon: ShieldCheck,
    title: "Safety first, always",
    body: "Verified drivers, live trip sharing, PIN verification and a 24/7 SOS line, on every single trip.",
  },
  {
    icon: Wallet,
    title: "Pay your way",
    body: "EcoCash, OneMoney, bank cards, Paynow or cash. Your money, your choice.",
  },
];

export default function Slides() {
  const [i, setI] = useState(0);
  const { icon: Icon, title, body } = slides[i];
  const last = i === slides.length - 1;

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8">
      <div className="flex justify-end pt-5">
        <Link href="/auth" className="text-[13.5px] font-semibold text-sub">
          Skip
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="flex h-28 w-28 items-center justify-center rounded-[36px] bg-brand-soft text-brand">
          <Icon size={56} />
        </span>
        <div className="mt-8 text-[26px] font-extrabold tracking-tight">
          Fast<span className="text-brand">Go</span>
        </div>
        <h1 className="mt-4 text-[21px] font-bold">{title}</h1>
        <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-sub">
          {body}
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, d) => (
          <span
            key={d}
            className={`h-2 rounded-full transition-all ${
              d === i ? "w-6 bg-brand" : "w-2 bg-line"
            }`}
          />
        ))}
      </div>

      {last ? (
        <Link
          href="/auth"
          className="block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Get Started
        </Link>
      ) : (
        <button
          onClick={() => setI(i + 1)}
          className="w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Next
        </button>
      )}

      <p className="mt-4 text-center text-[11.5px] text-faint">
        100% Zimbabwe Built • Compliant &amp; Licensed • Secure Payments
      </p>
    </div>
  );
}
