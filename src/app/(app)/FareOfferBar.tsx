"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Gear, Users, Briefcase, Plus } from "@/components/Icons";
import {
  MINIMUM_FARE,
  EXTRA_PASSENGER_FEE,
  HEAVY_LUGGAGE_FEE,
  MAX_EXTRA_PASSENGERS,
  fmt,
} from "@/lib/data";

export default function FareOfferBar() {
  const router = useRouter();
  const [fare, setFare] = useState("");
  const [shareRide, setShareRide] = useState(false);
  const [extraPassengers, setExtraPassengers] = useState(0);
  const [heavyLuggage, setHeavyLuggage] = useState(false);
  const [touched, setTouched] = useState(false);

  const parsed = parseFloat(fare);
  const isValid = fare.trim() !== "" && !Number.isNaN(parsed) && parsed >= MINIMUM_FARE;
  const showError = touched && !isValid;
  const extrasFee = extraPassengers * EXTRA_PASSENGER_FEE + (heavyLuggage ? HEAVY_LUGGAGE_FEE : 0);

  const findDriver = () => {
    setTouched(true);
    if (isValid) router.push("/searching");
  };

  return (
    <>
      <div
        className={`mt-2.5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ${
          showError ? "ring-bad" : "ring-transparent"
        }`}
      >
        <span className="shrink-0 text-[16px] font-bold text-sub">$</span>
        <input
          value={fare}
          onChange={(e) => {
            setFare(e.target.value);
            if (touched) setTouched(false);
          }}
          onBlur={() => fare.trim() !== "" && setTouched(true)}
          inputMode="decimal"
          placeholder={`Offer your fare (min ${fmt(MINIMUM_FARE)})`}
          className="flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-faint"
          aria-label="Offer your fare"
          aria-invalid={showError}
        />
        <span className="shrink-0 rounded-full bg-page p-1.5 text-sub">
          <Clock size={14} />
        </span>
      </div>
      {showError && (
        <p className="mt-1.5 px-1 text-[12px] font-medium text-bad">
          {fare.trim() === ""
            ? `Enter an offer to send your request. Minimum ${fmt(MINIMUM_FARE)}.`
            : `Offers below ${fmt(MINIMUM_FARE)} aren't accepted. Try a higher amount.`}
        </p>
      )}

      <div className="mt-2.5 rounded-2xl bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Users size={15} />
          </span>
          <span className="flex-1 text-left">
            <span className="block text-[13.5px] font-semibold">Extra Passengers</span>
            <span className="block text-[11.5px] text-sub">
              Beyond yourself: {fmt(EXTRA_PASSENGER_FEE)} each, for fairness
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2.5">
            <button
              onClick={() => setExtraPassengers((n) => Math.max(0, n - 1))}
              aria-label="Fewer extra passengers"
              disabled={extraPassengers === 0}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-sub disabled:opacity-30"
            >
              −
            </button>
            <span className="w-4 text-center text-[14px] font-bold">{extraPassengers}</span>
            <button
              onClick={() => setExtraPassengers((n) => Math.min(MAX_EXTRA_PASSENGERS, n + 1))}
              aria-label="More extra passengers"
              disabled={extraPassengers === MAX_EXTRA_PASSENGERS}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-sub disabled:opacity-30"
            >
              <Plus size={13} />
            </button>
          </span>
        </div>

        <button
          onClick={() => setHeavyLuggage((v) => !v)}
          className="mt-3 flex w-full items-center gap-3 border-t border-line pt-3 text-left"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Briefcase size={15} />
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-semibold">Luggage Over 10kg</span>
            <span className="block text-[11.5px] text-sub">
              Extra loading time &amp; space: {fmt(HEAVY_LUGGAGE_FEE)} flat fee
            </span>
          </span>
          <span
            role="switch"
            aria-checked={heavyLuggage}
            className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
              heavyLuggage ? "bg-good" : "bg-line"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                heavyLuggage ? "translate-x-5" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <button
        onClick={() => setShareRide((v) => !v)}
        className="mt-2.5 flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Users size={15} />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-[13.5px] font-semibold">Share &amp; Split Fare</span>
          <span className="block text-[11.5px] text-sub">
            Ride with others heading your way for a lower price
          </span>
        </span>
        <span
          role="switch"
          aria-checked={shareRide}
          className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
            shareRide ? "bg-good" : "bg-line"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
              shareRide ? "translate-x-5" : ""
            }`}
          />
        </span>
      </button>

      {extrasFee > 0 && isValid && (
        <p className="mt-2 px-1 text-[12px] text-sub">
          Total to send: <span className="font-bold text-ink">{fmt(parsed + extrasFee)}</span>{" "}
          ({fmt(parsed)} fare + {fmt(extrasFee)} extras)
        </p>
      )}

      <div className="mt-3.5 flex gap-2.5">
        <button
          onClick={findDriver}
          className="flex-1 rounded-xl bg-brand py-3.5 text-center text-[15px] font-bold text-white transition-colors hover:bg-brand-dark"
        >
          Find a Driver
        </button>
        <button
          onClick={() => router.push("/book")}
          aria-label="Ride options"
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-line bg-white text-sub"
        >
          <Gear size={20} />
        </button>
      </div>
    </>
  );
}
