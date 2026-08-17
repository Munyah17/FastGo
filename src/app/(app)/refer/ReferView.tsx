"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { Users, Share, ChevronRight, CheckCircle } from "@/components/Icons";
import { referral, fmt } from "@/lib/data";

export default function ReferView() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(referral.code).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="px-4 pb-6">
      <div className="rounded-2xl bg-brand px-4 py-5 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Users size={24} />
          </span>
          <span>
            <span className="block text-[16px] font-bold">Invite Partners</span>
            <span className="block text-[12.5px] text-white/75">
              Earn when they join and complete trips.
            </span>
          </span>
        </div>
      </div>

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">
        Your Referral Code
      </div>
      <Card className="flex items-center gap-3 px-4 py-3.5">
        <span className="flex-1 text-[18px] font-bold tracking-widest text-brand">
          {referral.code}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg bg-brand-soft px-3 py-1.5 text-[12.5px] font-semibold text-brand"
        >
          {copied ? (
            <>
              <CheckCircle size={14} /> Copied
            </>
          ) : (
            "Tap to copy"
          )}
        </button>
        <button
          aria-label="Share referral code"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sub"
        >
          <Share size={16} />
        </button>
      </Card>

      <Card className="mt-3.5 flex divide-x divide-line py-3.5 text-center">
        <div className="flex-1">
          <div className="text-[17px] font-bold">{referral.invited}</div>
          <div className="text-[12px] text-sub">Invited</div>
        </div>
        <div className="flex-1">
          <div className="text-[17px] font-bold">{referral.active}</div>
          <div className="text-[12px] text-sub">Active</div>
        </div>
        <div className="flex-1">
          <div className="text-[17px] font-bold">{fmt(referral.earned)}</div>
          <div className="text-[12px] text-sub">Earned</div>
        </div>
      </Card>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">
        <Share size={17} /> Share Your Link
      </button>

      <button className="mt-4 flex w-full items-center justify-center gap-1 text-[13.5px] font-semibold text-sub">
        How it works
        <ChevronRight size={15} />
      </button>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-faint">
        You earn {fmt(referral.perReferral)} once your invited partner completes their first 10 trips.
      </p>
    </div>
  );
}
