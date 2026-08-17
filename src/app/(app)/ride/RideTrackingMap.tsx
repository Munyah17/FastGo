"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrackingMap from "@/components/TrackingMap";
import { Card } from "@/components/ui";
import { Clock, CheckCircle, Flag } from "@/components/Icons";
import { FREE_WAIT_MINUTES, WAITING_FEE_PER_MIN, waitingDisputeReasons, fmt } from "@/lib/data";

type Stage = "enroute_pickup" | "waiting_at_pickup" | "confirm_start" | "in_progress" | "confirm_end";

export default function RideTrackingMap({
  pickup,
  dropoff,
}: {
  pickup: string;
  dropoff: string;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("enroute_pickup");
  const [arrivedAt, setArrivedAt] = useState<number | null>(null);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [imComing, setImComing] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState<string | null>(null);
  const [disputed, setDisputed] = useState(false);

  useEffect(() => {
    if (stage !== "waiting_at_pickup" || arrivedAt === null) return;
    const id = setInterval(() => setWaitSeconds(Math.floor((Date.now() - arrivedAt) / 1000)), 1000);
    const t = setTimeout(() => setStage("confirm_start"), 8000);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [stage, arrivedAt]);

  const freeSecs = FREE_WAIT_MINUTES * 60;
  const waitingFee =
    !disputed && waitSeconds > freeSecs
      ? Math.ceil((waitSeconds - freeSecs) / 60) * WAITING_FEE_PER_MIN
      : 0;

  if (showDispute) {
    return (
      <div className="px-4 py-4">
        <h2 className="text-[15px] font-bold">Dispute This Arrival</h2>
        <p className="mt-1 text-[13px] text-sub">
          If your driver marked arrival before actually being at the pickup
          point, the waiting fee is waived — this is reviewed automatically.
        </p>
        <div className="mt-3 space-y-2">
          {waitingDisputeReasons.map((r) => (
            <button
              key={r}
              onClick={() => setDisputeReason(r)}
              className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-[13.5px] font-medium ${
                disputeReason === r ? "border-brand bg-brand-soft text-brand" : "border-line bg-white"
              }`}
            >
              {r}
              {disputeReason === r && <CheckCircle size={16} />}
            </button>
          ))}
        </div>
        <button
          disabled={!disputeReason}
          onClick={() => {
            setDisputed(true);
            setShowDispute(false);
          }}
          className="mt-5 w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white disabled:opacity-40"
        >
          Submit Dispute
        </button>
        <button
          onClick={() => setShowDispute(false)}
          className="mt-2 w-full py-2 text-[13px] font-semibold text-sub"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (stage === "confirm_start" || stage === "confirm_end") {
    const isStart = stage === "confirm_start";
    return (
      <div className="px-4 py-6">
        <Card className="flex flex-col items-center gap-3 border-brand/20 bg-brand-soft px-5 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
            <Flag size={26} />
          </span>
          <span className="text-[16px] font-bold">
            {isStart ? "Your driver wants to start the ride" : "Your driver wants to end the ride here"}
          </span>
          <span className="text-[13px] text-sub">
            {isStart
              ? "Confirm once you're in the vehicle."
              : "Confirm you've arrived at your destination."}
          </span>
          <div className="mt-2 flex w-full gap-2.5">
            <button
              onClick={() => setStage(isStart ? "in_progress" : "enroute_pickup")}
              className="flex-1 rounded-xl border border-line bg-white py-3 text-[13.5px] font-semibold text-sub"
            >
              Not Yet
            </button>
            <button
              onClick={() => {
                if (isStart) setStage("in_progress");
                else router.push("/ride/complete");
              }}
              className="flex-1 rounded-xl bg-brand py-3 text-[13.5px] font-bold text-white"
            >
              Confirm
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <TrackingMap
        className="h-64"
        pickupAddress={pickup}
        dropoffAddress={dropoff}
        stage={stage === "in_progress" ? "in_progress" : "enroute_pickup"}
        onArrived={() => {
          if (stage === "enroute_pickup") {
            setArrivedAt(Date.now());
            setStage("waiting_at_pickup");
          } else if (stage === "in_progress") {
            setStage("confirm_end");
          }
        }}
      />

      {stage === "waiting_at_pickup" && (
        <div className="px-4 pt-3">
          <Card
            className={`px-4 py-3.5 ${
              waitingFee > 0 ? "border-warn/30 bg-warn-soft" : "border-good/20 bg-good-soft"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-good">
                <Clock size={17} />
              </span>
              <span className="flex-1">
                <span className="block text-[13.5px] font-bold">Your driver has arrived</span>
                <span className="block text-[12px] text-sub">
                  {disputed
                    ? "Dispute submitted — waiting fee waived"
                    : waitingFee > 0
                      ? `${fmt(waitingFee)} waiting fee — free wait time used`
                      : `${FREE_WAIT_MINUTES} min free wait`}
                </span>
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setImComing(true)}
                disabled={imComing}
                className="flex-1 rounded-xl bg-brand py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
              >
                {imComing ? "Driver notified ✓" : "I'm Coming"}
              </button>
              {!disputed && (
                <button
                  onClick={() => setShowDispute(true)}
                  className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-[12.5px] font-semibold text-bad"
                >
                  Dispute
                </button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
