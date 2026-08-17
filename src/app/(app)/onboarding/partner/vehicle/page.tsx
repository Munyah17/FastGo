"use client";

import { useState } from "react";
import Link from "next/link";
import OnboardingStepHeader from "../OnboardingStepHeader";
import { ShieldCheck } from "@/components/Icons";
import { vehicle } from "@/lib/data";

export default function VehicleInfoStep() {
  const [make, setMake] = useState(vehicle.make);
  const [model, setModel] = useState(vehicle.model);
  const [plate, setPlate] = useState(vehicle.plate);

  return (
    <div>
      <OnboardingStepHeader
        step={3}
        total={6}
        title="Onboarding"
        back="/onboarding/partner/license"
      />
      <div className="px-4 pb-8">
        <div className="flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-brand-soft">
          <svg viewBox="0 0 200 100" className="h-32 w-full" aria-hidden="true">
            <rect x="0" y="60" width="200" height="40" fill="#e0e7ff" />
            <rect x="10" y="35" width="18" height="30" fill="#c7d2fe" />
            <rect x="34" y="25" width="22" height="40" fill="#c7d2fe" />
            <rect x="150" y="30" width="20" height="35" fill="#c7d2fe" />
            <rect x="174" y="20" width="18" height="45" fill="#c7d2fe" />
            <ellipse cx="100" cy="82" rx="70" ry="6" fill="#c7d2fe" />
            <path
              d="M55 65 L65 45 Q70 38 80 38 L130 38 Q140 38 145 45 L155 65 Z"
              fill="#4f46e5"
            />
            <path
              d="M78 40 L84 50 H126 L132 40 Z"
              fill="#eef2ff"
            />
            <rect x="55" y="65" width="100" height="10" rx="3" fill="#3730a3" />
            <circle cx="75" cy="76" r="9" fill="#1f2937" />
            <circle cx="75" cy="76" r="3.5" fill="#d1d5db" />
            <circle cx="135" cy="76" r="9" fill="#1f2937" />
            <circle cx="135" cy="76" r="3.5" fill="#d1d5db" />
            <circle cx="100" cy="20" r="12" fill="#16a34a" />
            <path
              d="M94 20 l4 4 8 -8"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <div className="mt-4 flex items-center gap-2 text-brand">
          <ShieldCheck size={16} />
          <span className="text-[12.5px] font-semibold">
            Your vehicle stays registered to you — never to FastGo.
          </span>
        </div>

        <h2 className="mt-4 text-[17px] font-bold">Vehicle Information</h2>
        <p className="text-[13.5px] text-sub">Tell us about your vehicle.</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-sub">Make</label>
            <input
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">Model</label>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">
              Plate Number
            </label>
            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] font-semibold tracking-wider outline-none focus:border-brand"
            />
          </div>
        </div>

        <Link
          href="/onboarding/partner/documents"
          className="mt-8 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
