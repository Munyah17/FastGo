"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Phone, CreditCard, Wallet } from "@/components/Icons";
import { topupMethods, fmt } from "@/lib/data";

const amounts = [10, 20, 30, 50, 100];
const methodIcons = { phone: Phone, card: CreditCard, wallet: Wallet };
const instantMethods = new Set(["ecocash", "steward"]);

export default function TopupForm() {
  const [amount, setAmount] = useState(20);
  const [custom, setCustom] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);
  const [method, setMethod] = useState("ecocash");
  const [done, setDone] = useState(false);

  const finalAmount = usingCustom ? parseFloat(custom) || 0 : amount;

  if (done) {
    return (
      <div className="px-4 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-[28px]">
          ✓
        </div>
        <h2 className="mt-3 text-[19px] font-bold">Top Up Successful</h2>
        <p className="mt-1 text-[13.5px] text-sub">
          {fmt(finalAmount)} added to your FastGo Wallet via{" "}
          {topupMethods.find((m) => m.id === method)?.name}.
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
      <div className="mb-2 mt-1 text-[13px] font-semibold text-sub">
        Select Amount
      </div>
      <div className="grid grid-cols-3 gap-2">
        {amounts.map((a) => (
          <button
            key={a}
            onClick={() => {
              setAmount(a);
              setUsingCustom(false);
            }}
            className={`rounded-xl border-2 py-3 text-[14.5px] font-bold ${
              !usingCustom && amount === a
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-white text-sub"
            }`}
          >
            US${a}
          </button>
        ))}
        <button
          onClick={() => setUsingCustom(true)}
          className={`rounded-xl border-2 py-3 text-[14.5px] font-bold ${
            usingCustom
              ? "border-brand bg-brand-soft text-brand"
              : "border-line bg-white text-sub"
          }`}
        >
          Other
        </button>
      </div>

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">
        Choose Method
      </div>
      <Card>
        {topupMethods.map((m, i) => {
          const Icon = methodIcons[m.icon as keyof typeof methodIcons];
          return (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Icon size={17} />
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-medium">{m.name}</span>
                <span className="block text-[12.5px] text-sub">{m.detail}</span>
              </span>
              {instantMethods.has(m.id) && (
                <span className="rounded-full bg-good-soft px-2 py-0.5 text-[10.5px] font-semibold text-good">
                  Instant
                </span>
              )}
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
          );
        })}
      </Card>

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">
        Enter Amount
      </div>
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3.5 focus-within:border-brand">
        <span className="text-[15px] font-bold text-sub">US$</span>
        <input
          type="number"
          inputMode="decimal"
          placeholder={amount.toFixed(2)}
          value={usingCustom ? custom : finalAmount.toFixed(2)}
          onFocus={() => setUsingCustom(true)}
          onChange={(e) => {
            setUsingCustom(true);
            setCustom(e.target.value);
          }}
          className="w-full bg-transparent text-[16px] font-semibold outline-none placeholder:text-faint"
          aria-label="Top up amount"
        />
      </div>

      <button
        onClick={() => finalAmount > 0 && setDone(true)}
        disabled={finalAmount <= 0}
        className="mt-5 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-40"
      >
        Top Up Wallet
      </button>
      <p className="mt-3 text-center text-[12px] text-faint">
        Your wallet is used to pay FastGo fees automatically.
      </p>
    </div>
  );
}
