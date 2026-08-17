"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MapMock from "@/components/MapMock";
import { Card } from "@/components/ui";
import {
  ChevronDown,
  Shield,
  Star,
  Phone,
  Chat,
  Navigation,
  CheckCircle,
} from "@/components/Icons";

type Stage = "enroute_pickup" | "in_progress" | "completed";

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
  const pickup = params.get("pickup") ?? "Pickup point";
  const dropoff = params.get("dropoff") ?? "Destination";
  const fare = parseFloat(params.get("fare") ?? "5.00");

  const [stage, setStage] = useState<Stage>("enroute_pickup");
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  if (stage === "completed") {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-good">
          <CheckCircle size={34} />
        </span>
        <h1 className="mt-4 text-[20px] font-bold">Trip Complete</h1>
        <p className="mt-1 text-[13.5px] text-sub">
          US${fare.toFixed(2)} settled to your wallet, minus FastGo&apos;s platform
          service fee.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Back to Requests
        </button>
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
          <h1 className="text-[17px] font-semibold">Cancel Trip</h1>
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
        <h1 className="text-[17px] font-semibold">
          {stage === "enroute_pickup" ? "Heading to Pickup" : "Trip in Progress"}
        </h1>
        <Link
          href="/safety"
          aria-label="Safety"
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand hover:bg-white"
        >
          <Shield size={20} />
        </Link>
      </header>

      <MapMock className="h-56" showCar />

      <div className="px-4 pb-6">
        <Card className="mt-4 flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-[15px] font-bold text-brand">
            {passenger.split(" ").map((w) => w[0]).join("")}
          </span>
          <span className="flex-1">
            <span className="flex items-center gap-1.5 text-[14.5px] font-semibold">
              {passenger}
              <Star size={13} className="text-amber-400" />
              <span className="text-[12.5px] font-medium text-sub">{rating}</span>
            </span>
            <span className="block text-[12.5px] text-sub">FastGo Passenger</span>
          </span>
          <span className="flex gap-2">
            <button
              aria-label="Call passenger"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-sub"
            >
              <Phone size={17} />
            </button>
            <button
              aria-label="Message passenger"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white"
            >
              <Chat size={17} />
            </button>
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
            <span className="text-[15px] font-bold">US${fare.toFixed(2)}</span>
          </div>
        </Card>

        {stage === "enroute_pickup" ? (
          <button
            onClick={() => setStage("in_progress")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-bold text-white hover:bg-brand-dark"
          >
            <Navigation size={18} /> Arrived — Start Trip
          </button>
        ) : (
          <button
            onClick={() => setStage("completed")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-good py-3.5 text-[15px] font-bold text-white hover:bg-green-700"
          >
            <CheckCircle size={18} /> Complete Trip
          </button>
        )}
        <button
          onClick={() => setShowCancel(true)}
          className="mt-2.5 block w-full rounded-xl border border-line bg-white py-3 text-[13.5px] font-semibold text-bad"
        >
          Cancel Trip
        </button>
      </div>
    </div>
  );
}
