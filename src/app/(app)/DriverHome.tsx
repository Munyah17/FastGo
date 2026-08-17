"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ModeToggle from "@/components/ModeToggle";
import { Card } from "@/components/ui";
import {
  Menu,
  Bell,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Flag,
  Wallet,
  CreditCard,
} from "@/components/Icons";
import { incomingRequests, driverToday, fmt } from "@/lib/data";

type ReqState = "pending" | "bidding" | "confirmed" | "ignored" | "countering";
type PaymentPref = "all_methods" | "wallet_only";

export default function DriverHome() {
  const router = useRouter();
  const [online, setOnline] = useState(driverToday.online);
  const [states, setStates] = useState<Record<string, ReqState>>({});
  const [counterValue, setCounterValue] = useState<Record<string, string>>({});
  const [paymentPref, setPaymentPref] = useState<PaymentPref>("all_methods");

  const visible = incomingRequests.filter((r) => states[r.id] !== "ignored");
  const strikesLeft = driverToday.cancellationLimit - driverToday.cancellationsThisWeek;

  const bid = (id: string) =>
    setStates((s) => ({ ...s, [id]: "bidding" }));

  useEffect(() => {
    const biddingId = Object.entries(states).find(([, s]) => s === "bidding")?.[0];
    if (!biddingId) return;
    const t = setTimeout(() => {
      setStates((s) => ({ ...s, [biddingId]: "confirmed" }));
    }, 3200);
    return () => clearTimeout(t);
  }, [states]);

  const goToTrip = (r: (typeof incomingRequests)[number]) => {
    const params = new URLSearchParams({
      passenger: r.passenger,
      rating: String(r.rating),
      pickup: r.pickup,
      dropoff: r.dropoff,
      fare: String(r.offeredFare),
    });
    router.push(`/drive/active?${params.toString()}`);
  };

  return (
    <div className="px-4">
      <header className="flex items-center justify-between gap-2 py-4">
        <Link
          href="/profile"
          aria-label="Menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink"
        >
          <Menu size={20} />
        </Link>
        <ModeToggle />
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-bad" />
        </Link>
      </header>

      <Card
        className={`flex items-center gap-3 px-4 py-4 ${
          online ? "border-good/20 bg-good-soft" : "border-line"
        }`}
      >
        <span className="flex-1">
          <span className="block text-[15px] font-bold">
            {online ? "You're Online" : "You're Offline"}
          </span>
          <span className="block text-[12.5px] text-sub">
            {online
              ? "Receiving nearby ride requests"
              : "Go online to start receiving requests"}
          </span>
        </span>
        <button
          role="switch"
          aria-checked={online}
          aria-label="Go online"
          onClick={() => setOnline((v) => !v)}
          className={`h-8 w-14 shrink-0 rounded-full p-1 transition-colors ${
            online ? "bg-good" : "bg-line"
          }`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${
              online ? "translate-x-6" : ""
            }`}
          />
        </button>
      </Card>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        <Card className="px-3 py-3 text-center">
          <div className="text-[16px] font-bold">{fmt(driverToday.earningsToday)}</div>
          <div className="text-[11px] text-sub">Today</div>
        </Card>
        <Card className="px-3 py-3 text-center">
          <div className="text-[16px] font-bold">{driverToday.tripsToday}</div>
          <div className="text-[11px] text-sub">Trips</div>
        </Card>
        <Card className="px-3 py-3 text-center">
          <div className="text-[16px] font-bold">{driverToday.hoursOnline}</div>
          <div className="text-[11px] text-sub">Online</div>
        </Card>
      </div>

      <Card className="mt-3 px-4 py-3.5">
        <div className="text-[13px] font-semibold">Payments You Accept</div>
        <p className="mt-0.5 text-[11.5px] text-sub">
          Wallet-only removes cash-collection risk entirely, at the cost of a
          smaller matching pool.
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentPref("all_methods")}
            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-2.5 ${
              paymentPref === "all_methods"
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-white text-sub"
            }`}
          >
            <CreditCard size={17} />
            <span className="text-[12px] font-semibold">All Methods</span>
          </button>
          <button
            onClick={() => setPaymentPref("wallet_only")}
            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-2.5 ${
              paymentPref === "wallet_only"
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-white text-sub"
            }`}
          >
            <Wallet size={17} />
            <span className="text-[12px] font-semibold">Wallet Only</span>
          </button>
        </div>
      </Card>

      {driverToday.cancellationsThisWeek > 0 && (
        <Link
          href="/help"
          className="mt-3 flex items-center gap-3 rounded-2xl border border-warn/25 bg-warn-soft px-4 py-3"
        >
          <Flag size={16} className="shrink-0 text-warn" />
          <span className="flex-1 text-[12.5px] leading-snug text-ink">
            <span className="font-semibold">
              {driverToday.cancellationsThisWeek} of {driverToday.cancellationLimit}
            </span>{" "}
            cancellation strikes this week — only cancellations our fraud checks
            flag as suspicious count. {strikesLeft} more pauses your account;
            contact support if this looks wrong.
          </span>
        </Link>
      )}

      <h2 className="mb-2 mt-5 text-[15px] font-semibold">
        {online ? "Nearby Ride Requests" : "Preview: Nearby Ride Requests"}
      </h2>

      {!online && (
        <p className="mb-3 text-[13px] text-sub">
          Go online to bid on live requests like these — the passenger picks
          which driver gets the trip.
        </p>
      )}

      <div className={`space-y-3 ${online ? "" : "pointer-events-none opacity-50"}`}>
        {visible.map((r) => {
          const state = states[r.id] ?? "pending";
          return (
            <Card key={r.id} className="px-4 py-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-[12px] font-bold text-brand">
                    {r.passenger.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <span>
                    <span className="flex items-center gap-1 text-[13.5px] font-semibold">
                      {r.passenger}
                      <Star size={12} className="text-amber-400" />
                      <span className="text-[12px] font-medium text-sub">{r.rating}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11.5px] text-sub">
                      <MapPin size={11} /> {r.distanceKm} km away • {r.etaMin} min
                    </span>
                  </span>
                </div>
                <span className="shrink-0 text-[15px] font-bold text-good">
                  {fmt(r.offeredFare)}
                </span>
              </div>

              <div className="mt-2.5 space-y-1 border-t border-line pt-2.5 text-[12.5px]">
                <div className="flex gap-2">
                  <span className="w-10 shrink-0 text-faint">From</span>
                  <span className="font-medium">{r.pickup}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-10 shrink-0 text-faint">To</span>
                  <span className="font-medium">{r.dropoff}</span>
                </div>
              </div>

              {state === "confirmed" ? (
                <button
                  onClick={() => goToTrip(r)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-good py-2.5 text-[13px] font-bold text-white"
                >
                  <CheckCircle size={16} /> Passenger confirmed you — start trip
                </button>
              ) : state === "bidding" ? (
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-soft px-3 py-2.5 text-[13px] font-semibold text-brand">
                  <Clock size={15} /> Bid sent — waiting for passenger to choose a driver…
                </div>
              ) : state === "countering" ? (
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex-1 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
                    <span className="text-[13px] font-bold text-sub">$</span>
                    <input
                      autoFocus
                      inputMode="decimal"
                      placeholder={r.offeredFare.toFixed(2)}
                      value={counterValue[r.id] ?? ""}
                      onChange={(e) =>
                        setCounterValue((s) => ({ ...s, [r.id]: e.target.value }))
                      }
                      className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint"
                      aria-label={`Counter offer for ${r.passenger}`}
                    />
                  </span>
                  <button
                    onClick={() => bid(r.id)}
                    className="rounded-xl bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-white"
                  >
                    Send Bid
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => bid(r.id)}
                    className="flex-1 rounded-xl bg-brand py-2.5 text-[13px] font-bold text-white"
                  >
                    Bid {fmt(r.offeredFare)}
                  </button>
                  <button
                    onClick={() => setStates((s) => ({ ...s, [r.id]: "countering" }))}
                    className="flex-1 rounded-xl border border-line bg-white py-2.5 text-[13px] font-semibold text-sub"
                  >
                    Counter
                  </button>
                  <button
                    aria-label="Ignore request"
                    onClick={() => setStates((s) => ({ ...s, [r.id]: "ignored" }))}
                    className="rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] font-semibold text-faint"
                  >
                    ✕
                  </button>
                </div>
              )}
            </Card>
          );
        })}

        {visible.length === 0 && (
          <Card className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <Clock size={22} className="text-faint" />
            <span className="text-[13.5px] text-sub">
              No more nearby requests right now.
            </span>
          </Card>
        )}
      </div>
    </div>
  );
}
