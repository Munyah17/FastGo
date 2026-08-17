"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Wallet, Phone, CreditCard, ShieldCheck } from "@/components/Icons";
import { insurance, user, fmt } from "@/lib/data";

const methods = [
  { id: "wallet", name: "FastGo Wallet", icon: Wallet },
  { id: "ecocash", name: "EcoCash Instant Payments", icon: Phone },
  { id: "card", name: "Visa / Mastercard", icon: CreditCard },
] as const;

export default function PayPremiumForm() {
  const [method, setMethod] = useState<(typeof methods)[number]["id"]>("wallet");
  const [done, setDone] = useState(false);

  const amount = insurance.monthlyPremium;
  const walletShort = method === "wallet" && user.walletBalance < amount;

  if (done) {
    return (
      <div className="px-4 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-good">
          <ShieldCheck size={30} />
        </div>
        <h2 className="mt-3 text-[19px] font-bold">Premium Paid</h2>
        <p className="mt-1 text-[13.5px] text-sub">
          {fmt(amount)} paid via{" "}
          {methods.find((m) => m.id === method)?.name}. Your Legal Aid
          Cover stays active with no interruption.
        </p>
        <Link
          href="/insurance"
          className="mt-6 block w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Back to Legal Aid Cover
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6">
      <Card className="px-4 py-4 text-center">
        <div className="text-[12.5px] text-sub">Amount Due</div>
        <div className="text-[26px] font-bold">{fmt(amount)}</div>
        <div className="text-[12px] text-sub">
          Legal Aid + Comprehensive Cover • {insurance.policyNumber}
        </div>
      </Card>

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">
        Pay With
      </div>
      <Card>
        {methods.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand">
              <m.icon size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-medium">{m.name}</span>
              {m.id === "wallet" && (
                <span
                  className={`block text-[12.5px] ${
                    walletShort ? "font-semibold text-bad" : "text-sub"
                  }`}
                >
                  Balance: {fmt(user.walletBalance)}
                  {walletShort ? " • Insufficient" : ""}
                </span>
              )}
            </span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                method === m.id ? "border-brand" : "border-line"
              }`}
            >
              {method === m.id && (
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              )}
            </span>
          </button>
        ))}
      </Card>

      {walletShort ? (
        <Link
          href="/wallet/topup"
          className="mt-5 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Top Up Wallet to Pay
        </Link>
      ) : (
        <button
          onClick={() => setDone(true)}
          className="mt-5 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Pay {fmt(amount)}
        </button>
      )}
      <p className="mt-3 text-center text-[12px] text-faint">
        Missed premiums pause your Legal Aid Cover — pay on time to stay covered.
      </p>
    </div>
  );
}
