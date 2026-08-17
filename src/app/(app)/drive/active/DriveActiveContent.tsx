"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import TrackingMap from "@/components/TrackingMap";
import Avatar from "@/components/Avatar";
import { Card } from "@/components/ui";
import {
  ChevronDown,
  Shield,
  Star,
  Phone,
  Chat,
  Navigation,
  CheckCircle,
  Clock,
  MapPin,
} from "@/components/Icons";
import { FREE_WAIT_MINUTES, WAITING_FEE_PER_MIN, fmt } from "@/lib/data";

type Stage =
  | "enroute_pickup"
  | "waiting_at_pickup"
  | "awaiting_start_confirmation"
  | "in_progress"
  | "awaiting_end_confirmation"
  | "rate_passenger"
  | "completed";

const cancelReasons = [
  "Passenger no-show",
  "Wrong pickup location",
  "Safety concern",
  "Vehicle issue",
  "Passenger requested cancellation",
  "Other",
];

export default function DriveActiveContent() {
  const router = useRouter();
  const params = useSearchParams();
  const passenger = params.get("passenger") ?? "Passenger";
  const rating = params.get("rating") ?? "4.8";
  const phone = params.get("phone") ?? "";
  const pickup = params.get("pickup") ?? "Pickup point";
  const dropoff = params.get("dropoff") ?? "Destination";
  const fare = parseFloat(params.get("fare") ?? "5.00");

  const [stage, setStage] = useState<Stage>("enroute_pickup");
  const [arrivedAt, setArrivedAt] = useState<number | null>(null);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [passengerStars, setPassengerStars] = useState(0);
  const [showClaim, setShowClaim] = useState(false);
  const [claimResult, setClaimResult] = useState<number | null>(null);

  useEffect(() => {
    if (stage !== "waiting_at_pickup" || arrivedAt === null) return;
    const id = setInterval(() => setWaitSeconds(Math.floor((Date.now() - arrivedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [stage, arrivedAt]);

  useEffect(() => {
    if (stage !== "awaiting_start_confirmation" && stage !== "awaiting_end_confirmation") return;
    const t = setTimeout(
      () => setStage(stage === "awaiting_start_confirmation" ? "in_progress" : "rate_passenger"),
      2500
    );
    return () => clearTimeout(t);
  }, [stage]);

  const freeSecs = FREE_WAIT_MINUTES * 60;
  const waitingFee =
    waitSeconds > freeSecs ? Math.ceil((waitSeconds - freeSecs) / 60) * WAITING_FEE_PER_MIN : 0;

  if (stage === "rate_passenger") {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
        <Avatar name={passenger} size={64} className="mx-auto text-[19px]" />
        <h1 className="mt-4 text-[19px] font-bold">Rate {passenger.split(" ")[0]}</h1>
        <p className="mt-1 text-[13px] text-sub">How was this passenger?</p>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setPassengerStars(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className={n <= passengerStars ? "text-amber-400" : "text-line"}
            >
              <Star size={30} />
            </button>
          ))}
        </div>
        <button
          onClick={() => setStage("completed")}
          disabled={passengerStars === 0}
          className="mt-6 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-40"
        >
          Submit Rating
        </button>
      </div>
    );
  }

  if (stage === "completed") {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-good">
          <CheckCircle size={34} />
        </span>
        <h1 className="mt-4 text-[20px] font-bold">Ride Complete</h1>
        <p className="mt-1 text-[13.5px] text-sub">
          {fmt(fare + waitingFee)} settled to your wallet, minus FastGo&apos;s
          platform service fee.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Back to Requests
        </button>
        <button
          onClick={() => setShowClaim(true)}
          className="mt-3 text-[12.5px] font-semibold text-sub underline"
        >
          Actual drop-off was different from what was declared?
        </button>
      </div>
    );
  }

  if (showClaim) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
        {claimResult === null ? (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-warn-soft text-warn">
              <MapPin size={30} />
            </span>
            <h1 className="mt-4 text-[19px] font-bold">Report Destination Discrepancy</h1>
            <p className="mt-1 text-[13px] leading-relaxed text-sub">
              We compare your GPS trail against the declared drop-off. If the
              actual endpoint is more than 100m away, the fare is
              automatically adjusted and charged to the passenger&apos;s
              wallet — no manual review needed.
            </p>
            <button
              onClick={() => {
                // Demo-only: real check runs file_fare_adjustment_claim()
                // server-side against actual trip_locations GPS evidence.
                const discrepancyM = 1200;
                const extra = discrepancyM > 100 ? Math.round(fare * 0.45 * 100) / 100 : 0;
                setClaimResult(extra);
              }}
              className="mt-6 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
            >
              Check My GPS Trail
            </button>
            <button
              onClick={() => setShowClaim(false)}
              className="mt-3 text-[13px] font-semibold text-sub"
            >
              Back
            </button>
          </>
        ) : claimResult > 0 ? (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-good">
              <CheckCircle size={30} />
            </span>
            <h1 className="mt-4 text-[19px] font-bold">Claim Approved</h1>
            <p className="mt-1 text-[13.5px] text-sub">
              Your actual route ran well past the declared drop-off.{" "}
              <span className="font-bold text-ink">{fmt(claimResult)}</span>{" "}
              has been added to your wallet and charged to the passenger.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-page text-faint">
              <MapPin size={30} />
            </span>
            <h1 className="mt-4 text-[19px] font-bold">Not Eligible</h1>
            <p className="mt-1 text-[13.5px] text-sub">
              Your GPS trail ended within 100m of the declared drop-off —
              this doesn&apos;t qualify for an adjustment.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
            >
              Done
            </button>
          </>
        )}
      </div>
    );
  }

  if (showCancel) {
    return (
      <div>
        <header className="sticky top-0 z-20 flex items-center gap-2 bg-page/95 px-4 py-4 backdrop-blur">
          <button
            onClick={() => setShowCancel(false)}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white"
          >
            <ChevronDown size={22} />
          </button>
          <h1 className="text-[17px] font-semibold">Cancel Ride</h1>
        </header>
        <div className="px-4 pb-8">
          <p className="text-[13px] text-sub">
            Every cancellation is reviewed automatically — GPS and trip data
            confirm whether it&apos;s genuine, so honest cancellations never
            count against you.
          </p>
          <div className="mt-4 space-y-2">
            {cancelReasons.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-[13.5px] font-medium ${
                  reason === r ? "border-brand bg-brand-soft text-brand" : "border-line bg-white"
                }`}
              >
                {r}
                {reason === r && <CheckCircle size={16} />}
              </button>
            ))}
          </div>
          <button
            disabled={!reason}
            onClick={() => router.push("/")}
            className="mt-6 w-full rounded-xl bg-bad py-3.5 text-[15px] font-semibold text-white disabled:opacity-40"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    );
  }

  const headerTitle =
    stage === "enroute_pickup"
      ? "Heading to Pickup"
      : stage === "waiting_at_pickup"
        ? "Waiting at Pickup"
        : stage === "awaiting_start_confirmation"
          ? "Confirming with Passenger"
          : stage === "awaiting_end_confirmation"
            ? "Confirming with Passenger"
            : "Ride in Progress";

  return (
    <div>
      <header className="sticky top-0 z-20 flex items-center justify-between bg-page/95 px-4 py-4 backdrop-blur">
        <button
          onClick={() => router.push("/")}
          aria-label="Collapse"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white"
        >
          <ChevronDown size={22} />
        </button>
        <h1 className="text-[17px] font-semibold">{headerTitle}</h1>
        <Link
          href="/safety"
          aria-label="Safety"
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand hover:bg-white"
        >
          <Shield size={20} />
        </Link>
      </header>

      <TrackingMap
        className="h-56"
        pickupAddress={pickup}
        dropoffAddress={dropoff}
        stage={stage === "in_progress" ? "in_progress" : "enroute_pickup"}
      />

      <div className="px-4 pb-6">
        <Card className="mt-4 flex items-center gap-3 px-4 py-3.5">
          <Avatar name={passenger} size={44} className="text-[15px]" />
          <span className="flex-1">
            <span className="flex items-center gap-1.5 text-[14.5px] font-semibold">
              {passenger}
              <Star size={13} className="text-amber-400" />
              <span className="text-[12.5px] font-medium text-sub">{rating}</span>
            </span>
            <span className="block text-[12.5px] text-sub">FastGo Passenger</span>
          </span>
          <span className="flex gap-2">
            <a
              href={phone ? `tel:${phone}` : undefined}
              aria-label="Call passenger"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-line text-sub ${
                !phone ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <Phone size={17} />
            </a>
            <Link
              href="/messages/chat"
              aria-label="Message passenger"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white"
            >
              <Chat size={17} />
            </Link>
          </span>
        </Card>

        <Card className="mt-3 px-4 py-3.5">
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1 pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-good" />
              <span className="h-7 w-px border-l border-dashed border-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-bad" />
            </div>
            <div className="flex-1">
              <div className="pb-2.5">
                <div className="text-[11px] text-faint">Pickup</div>
                <div className="text-[14px] font-medium">{pickup}</div>
              </div>
              <div className="border-t border-line pt-2.5">
                <div className="text-[11px] text-faint">Drop-off</div>
                <div className="text-[14px] font-medium">{dropoff}</div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="text-[13px] text-sub">Agreed Fare</span>
            <span className="text-[15px] font-bold">
              {fmt(fare)}
              {waitingFee > 0 && (
                <span className="ml-1.5 text-[12px] font-semibold text-warn">
                  + {fmt(waitingFee)} wait
                </span>
              )}
            </span>
          </div>
        </Card>

        {stage === "waiting_at_pickup" && (
          <Card
            className={`mt-3 px-4 py-3.5 ${
              waitingFee > 0 ? "border-warn/30 bg-warn-soft" : "border-brand/20 bg-brand-soft"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                <Clock size={17} />
              </span>
              <span className="flex-1">
                <span className="block text-[13.5px] font-bold">
                  {String(Math.floor(waitSeconds / 60)).padStart(1, "0")}:
                  {String(waitSeconds % 60).padStart(2, "0")} waiting
                </span>
                <span className="block text-[12px] text-sub">
                  {waitingFee > 0
                    ? `Free wait used — ${fmt(waitingFee)} waiting fee accruing`
                    : `${FREE_WAIT_MINUTES} min free, then a small waiting fee applies`}
                </span>
              </span>
            </div>
          </Card>
        )}

        {stage === "enroute_pickup" && (
          <button
            onClick={() => {
              setArrivedAt(Date.now());
              setStage("waiting_at_pickup");
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-bold text-white hover:bg-brand-dark"
          >
            <MapPin size={18} /> I&apos;ve Arrived
          </button>
        )}

        {stage === "waiting_at_pickup" && (
          <button
            onClick={() => setStage("awaiting_start_confirmation")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-bold text-white hover:bg-brand-dark"
          >
            <Navigation size={18} /> Start Ride
          </button>
        )}

        {(stage === "awaiting_start_confirmation" || stage === "awaiting_end_confirmation") && (
          <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-page py-3.5 text-[14px] font-semibold text-sub">
            <Clock size={16} className="animate-pulse" /> Waiting for passenger to confirm…
          </div>
        )}

        {stage === "in_progress" && (
          <button
            onClick={() => setStage("awaiting_end_confirmation")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-good py-3.5 text-[15px] font-bold text-white hover:bg-green-700"
          >
            <CheckCircle size={18} /> End Ride
          </button>
        )}

        {stage !== "in_progress" &&
          stage !== "awaiting_start_confirmation" &&
          stage !== "awaiting_end_confirmation" && (
            <button
              onClick={() => setShowCancel(true)}
              className="mt-2.5 block w-full rounded-xl border border-line bg-white py-3 text-[13.5px] font-semibold text-bad"
            >
              Cancel Ride
            </button>
          )}
      </div>
    </div>
  );
}
