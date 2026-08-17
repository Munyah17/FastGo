"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui";
import Avatar from "@/components/Avatar";
import { HandCoins, CheckCircle } from "@/components/Icons";
import { scanToPayContacts, fmt, CASHBACK_FEE_RATE } from "@/lib/data";
import { useMode } from "@/lib/ModeContext";

type Purpose = "send" | "cashback" | "request_cashback";

const amounts = [2, 5, 10, 20];

export default function SendToUserFlow() {
  const params = useSearchParams();
  const { mode } = useMode();
  const contact = scanToPayContacts.find((c) => c.id === params.get("to"));

  const [purpose, setPurpose] = useState<Purpose>("send");
  const [amount, setAmount] = useState(5);
  const [custom, setCustom] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);
  const [done, setDone] = useState(false);

  if (!contact) {
    return (
      <div className="px-4 pt-10 text-center">
        <p className="text-[13.5px] text-sub">
          We couldn&apos;t find that recipient. Try scanning their code again.
        </p>
        <Link
          href="/wallet/scan-to-pay"
          className="mt-4 inline-block rounded-xl bg-brand px-5 py-2.5 text-[13.5px] font-semibold text-white"
        >
          Back to Scan to Pay
        </Link>
      </div>
    );
  }

  const canGiveCashback = mode === "driver" && contact.role === "passenger";
  const canRequestCashback = mode === "passenger" && contact.role === "driver";
  const finalAmount = usingCustom ? parseFloat(custom) || 0 : amount;
  const fee = purpose === "cashback" ? Math.round(finalAmount * CASHBACK_FEE_RATE * 100) / 100 : 0;
  const recipientGets = finalAmount - fee;

  if (done) {
    return (
      <div className="px-4 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-good">
          <CheckCircle size={30} />
        </div>
        {purpose === "request_cashback" ? (
          <>
            <h2 className="mt-3 text-[19px] font-bold">Request Sent</h2>
            <p className="mt-1 px-4 text-[13.5px] text-sub">
              We let {contact.name} know you&apos;d like {fmt(finalAmount)} in
              change. It&apos;s their call. They&apos;ll send it via Scan to
              Pay if they&apos;re able to.
            </p>
          </>
        ) : purpose === "cashback" ? (
          <>
            <h2 className="mt-3 text-[19px] font-bold">Cash Back Sent</h2>
            <p className="mt-1 px-4 text-[13.5px] text-sub">
              {fmt(recipientGets)} sent to {contact.name}. You kept{" "}
              {fmt(fee)} ({Math.round(CASHBACK_FEE_RATE * 100)}%) as a
              handling fee.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-3 text-[19px] font-bold">Money Sent</h2>
            <p className="mt-1 text-[13.5px] text-sub">
              {fmt(finalAmount)} sent to {contact.name}.
            </p>
          </>
        )}
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
      <Card className="flex items-center gap-3 px-4 py-3.5">
        <Avatar name={contact.name} avatarUrl={contact.avatarUrl} size={44} className="text-[14px]" />
        <span className="flex-1">
          <span className="block text-[14.5px] font-semibold">{contact.name}</span>
          <span className="block text-[12px] capitalize text-sub">{contact.phone} • {contact.role}</span>
        </span>
      </Card>

      {(canGiveCashback || canRequestCashback) && (
        <div className="mt-4">
          <div className="mb-2 text-[13px] font-semibold text-sub">What&apos;s this for?</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPurpose("send")}
              className={`rounded-xl border-2 px-3 py-2.5 text-[13px] font-semibold ${
                purpose === "send" ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-sub"
              }`}
            >
              Send Money
            </button>
            {canGiveCashback && (
              <button
                onClick={() => setPurpose("cashback")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-[13px] font-semibold ${
                  purpose === "cashback" ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-sub"
                }`}
              >
                <HandCoins size={14} /> Give Cash Back
              </button>
            )}
            {canRequestCashback && (
              <button
                onClick={() => setPurpose("request_cashback")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-[13px] font-semibold ${
                  purpose === "request_cashback" ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-sub"
                }`}
              >
                <HandCoins size={14} /> Request Cash Back
              </button>
            )}
          </div>
          {purpose === "cashback" && (
            <p className="mt-2 text-[12px] text-sub">
              For giving change digitally instead of cash. You keep{" "}
              {Math.round(CASHBACK_FEE_RATE * 100)}% as a handling fee.
            </p>
          )}
          {purpose === "request_cashback" && (
            <p className="mt-2 text-[12px] text-sub">
              This just lets {contact.name} know. Drivers choose whether to
              send cash back, it&apos;s never automatic or required.
            </p>
          )}
        </div>
      )}

      <div className="mb-2 mt-5 text-[13px] font-semibold text-sub">
        {purpose === "request_cashback" ? "Amount You're Owed" : "Amount"}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {amounts.map((a) => (
          <button
            key={a}
            onClick={() => {
              setAmount(a);
              setUsingCustom(false);
            }}
            className={`rounded-xl border-2 py-3 text-[14px] font-bold ${
              !usingCustom && amount === a ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-sub"
            }`}
          >
            US${a}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3.5 focus-within:border-brand">
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
          aria-label="Amount"
        />
      </div>

      {purpose === "cashback" && finalAmount > 0 && (
        <Card className="mt-3.5 px-4 py-3 text-[13px]">
          <div className="flex justify-between py-0.5">
            <span className="text-sub">{contact.name} receives</span>
            <span className="font-semibold">{fmt(recipientGets)}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-sub">You keep ({Math.round(CASHBACK_FEE_RATE * 100)}% fee)</span>
            <span className="font-semibold text-good">{fmt(fee)}</span>
          </div>
        </Card>
      )}

      <button
        onClick={() => finalAmount > 0 && setDone(true)}
        disabled={finalAmount <= 0}
        className="mt-5 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-40"
      >
        {purpose === "request_cashback"
          ? "Send Request"
          : purpose === "cashback"
            ? `Give ${fmt(finalAmount)} Cash Back`
            : `Send ${fmt(finalAmount)}`}
      </button>
      <p className="mt-3 text-center text-[12px] text-faint">
        {purpose === "send" && "Only your available wallet balance can be sent this way. Driver earnings can only be withdrawn."}
      </p>
    </div>
  );
}
