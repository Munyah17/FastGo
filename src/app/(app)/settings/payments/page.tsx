"use client";

import { useState } from "react";
import { ScreenHeader, Card } from "@/components/ui";
import { CreditCard, Wallet } from "@/components/Icons";

type PaymentPref = "all_methods" | "wallet_only";

export default function DriverPaymentSettingsPage() {
  const [paymentPref, setPaymentPref] = useState<PaymentPref>("all_methods");

  return (
    <div>
      <ScreenHeader title="Payments You Accept" back="/settings" />
      <div className="px-4 pb-6">
        <p className="text-[13px] text-sub">
          Choose which payment methods you&apos;re matched with as a driver.
          Wallet-only removes cash-collection risk entirely, at the cost of a
          smaller matching pool.
        </p>

        <Card className="mt-4">
          <button
            onClick={() => setPaymentPref("all_methods")}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <CreditCard size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-medium">All Methods</span>
              <span className="block text-[12px] text-sub">
                Cash, wallet, EcoCash, cards: widest matching pool
              </span>
            </span>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                paymentPref === "all_methods" ? "border-brand" : "border-line"
              }`}
            >
              {paymentPref === "all_methods" && (
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              )}
            </span>
          </button>
          <div className="mx-4 h-px bg-line" />
          <button
            onClick={() => setPaymentPref("wallet_only")}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Wallet size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-medium">Wallet Only</span>
              <span className="block text-[12px] text-sub">
                No cash: zero fee-collection risk, fewer matches
              </span>
            </span>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                paymentPref === "wallet_only" ? "border-brand" : "border-line"
              }`}
            >
              {paymentPref === "wallet_only" && (
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              )}
            </span>
          </button>
        </Card>
      </div>
    </div>
  );
}
