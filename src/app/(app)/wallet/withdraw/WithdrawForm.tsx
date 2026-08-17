"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Phone, CreditCard } from "@/components/Icons";
import { user, fmt } from "@/lib/data";

const destinations = [
  { id: "ecocash", name: "EcoCash", detail: "077 *** 5678", icon: Phone },
  { id: "bank", name: "Bank Account", detail: "CBZ **** 3310", icon: CreditCard },
];

export default function WithdrawForm() {
  const [amount, setAmount] = useState("");
  const [dest, setDest] = useState("ecocash");
  const [done, setDone] = useState(false);
  const value = parseFloat(amount) || 0;
  const valid = value > 0 && value <= user.walletBalance;

  if (done) {
    return (
      <div className="px-4 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-[28px]">
          ✓
        </div>
        <h2 className="mt-3 text-[19px] font-bold">Withdrawal Requested</h2>
        <p className="mt-1 text-[13.5px] text-sub">
          {fmt(value)} will arrive in your{" "}
          {destinations.find((d) => d.id === dest)?.name} shortly.
        </p>
        <Link
          href="/wallet"
          className="mt-6 block w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Back to Wallet
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6">
      <Card className="px-4 py-3.5 text-center">
        <div className="text-[12.5px] text-sub">Available Balance</div>
        <div className="text-[24px] font-bold">{fmt(user.walletBalance)}</div>
      </Card>

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">Amount</div>
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3.5 focus-within:border-brand">
        <span className="text-[15px] font-bold text-sub">US$</span>
        <input
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-transparent text-[16px] font-semibold outline-none placeholder:text-faint"
          aria-label="Withdrawal amount"
        />
        <button
          onClick={() => setAmount(user.walletBalance.toFixed(2))}
          className="rounded-lg bg-brand-soft px-2.5 py-1 text-[12px] font-bold text-brand"
        >
          MAX
        </button>
      </div>
      {value > user.walletBalance && (
        <p className="mt-1.5 text-[12.5px] font-medium text-bad">
          Amount exceeds your available balance.
        </p>
      )}

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">
        Withdraw To
      </div>
      <Card>
        {destinations.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setDest(d.id)}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand">
              <d.icon size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-medium">{d.name}</span>
              <span className="block text-[12.5px] text-sub">{d.detail}</span>
            </span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                dest === d.id ? "border-brand" : "border-line"
              }`}
            >
              {dest === d.id && (
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              )}
            </span>
          </button>
        ))}
      </Card>

      <button
        onClick={() => valid && setDone(true)}
        disabled={!valid}
        className="mt-5 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-40"
      >
        Withdraw {value > 0 ? fmt(value) : ""}
      </button>
    </div>
  );
}
