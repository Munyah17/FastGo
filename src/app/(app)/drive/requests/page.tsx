"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, Card } from "@/components/ui";
import Avatar from "@/components/Avatar";
import { Star, MapPin, Clock, CheckCircle } from "@/components/Icons";
import { incomingRequests, fmt } from "@/lib/data";

type ReqState = "pending" | "bidding" | "confirmed" | "ignored" | "countering";

export default function DriveRequestsPage() {
  const router = useRouter();
  const [states, setStates] = useState<Record<string, ReqState>>({});
  const [counterValue, setCounterValue] = useState<Record<string, string>>({});

  const visible = incomingRequests.filter((r) => states[r.id] !== "ignored");

  const bid = (id: string) => setStates((s) => ({ ...s, [id]: "bidding" }));

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
      phone: r.phone,
      pickup: r.pickup,
      dropoff: r.dropoff,
      fare: String(r.offeredFare),
    });
    router.push(`/drive/active?${params.toString()}`);
  };

  return (
    <div>
      <ScreenHeader title="Ride Requests" back="/" />
      <div className="px-4 pb-6">
        <p className="mb-3 text-[13px] text-sub">
          Bid the offered fare, counter with your own, or ignore — the
          passenger picks which driver gets the trip, just like an auction.
        </p>

        <div className="space-y-3">
          {visible.map((r) => {
            const state = states[r.id] ?? "pending";
            return (
              <Card key={r.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={r.passenger} size={36} className="text-[12px]" />
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
    </div>
  );
}
