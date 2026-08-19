"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouteTracking } from "@/lib/useRouteTracking";
import { MapPin, Loader2, Navigation } from "@/components/Icons";
import type { MapMarker } from "@/components/LiveMap";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-page text-faint">
      <Loader2 size={22} className="animate-spin" />
    </div>
  ),
});

const HARARE: [number, number] = [-17.8252, 31.0335];

async function geocode(address: string): Promise<[number, number]> {
  try {
    const res = await fetch(`/api/places/search?q=${encodeURIComponent(address)}`);
    const data = await res.json();
    const first = data.results?.[0];
    if (first) return [first.lat, first.lon];
  } catch {
    // fall through to default
  }
  return HARARE;
}

// Deterministic pseudo-random point ~1.5-2.5km from base, so a "driver
// starting position" looks plausible without needing real GPS.
function offsetPoint(base: [number, number], seed: string): [number, number] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const angle = (hash % 360) * (Math.PI / 180);
  const distKm = 1.5 + (hash % 100) / 100;
  const dLat = (distKm / 111) * Math.cos(angle);
  const dLon = (distKm / (111 * Math.cos((base[0] * Math.PI) / 180))) * Math.sin(angle);
  return [base[0] + dLat, base[1] + dLon];
}

export default function TrackingMap({
  pickupAddress,
  dropoffAddress,
  stage,
  onArrived,
  className = "",
}: {
  pickupAddress: string;
  dropoffAddress: string;
  stage: "enroute_pickup" | "in_progress";
  onArrived?: () => void;
  className?: string;
}) {
  const [pickup, setPickup] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState<[number, number] | null>(null);
  const arrivedFired = useRef(false);

  useEffect(() => {
    let cancelled = false;
    // Sequential, not Promise.all — Nominatim's usage policy is ~1 req/sec
    // with no concurrent requests; firing pickup+dropoff geocoding at once
    // routinely got one of them silently rejected, falling back to the
    // Harare default and putting a pin in the wrong place.
    (async () => {
      const p = await geocode(pickupAddress);
      if (cancelled) return;
      setPickup(p);
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
      const d = await geocode(dropoffAddress);
      if (cancelled) return;
      setDropoff(d);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupAddress, dropoffAddress]);

  const vehicleStart = pickup ? offsetPoint(pickup, pickupAddress) : HARARE;
  const from = stage === "enroute_pickup" ? vehicleStart : (pickup ?? HARARE);
  const to = stage === "enroute_pickup" ? (pickup ?? HARARE) : (dropoff ?? HARARE);

  const { position, etaMin, route, loading, arrived } = useRouteTracking(from, to, {
    demoSeconds: stage === "enroute_pickup" ? 22 : 30,
    active: !!pickup && !!dropoff,
  });

  useEffect(() => {
    if (arrived && !arrivedFired.current) {
      arrivedFired.current = true;
      onArrived?.();
    }
  }, [arrived, onArrived]);

  useEffect(() => {
    arrivedFired.current = false;
  }, [stage]);

  const markers: MapMarker[] = [];
  if (pickup) markers.push({ position: pickup, kind: "pickup" });
  if (dropoff) markers.push({ position: dropoff, kind: "dropoff" });
  if (!loading) markers.push({ position, kind: "vehicle" });

  return (
    <div className={`relative ${className}`}>
      <LiveMap
        className="h-full w-full"
        center={position}
        zoom={15}
        interactive={false}
        markers={markers}
        route={route}
        recenterKey={`${position[0].toFixed(4)},${position[1].toFixed(4)}`}
      />
      <div className="absolute inset-x-3 top-3 z-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
        {loading || pickup === null ? (
          <>
            <Loader2 size={17} className="shrink-0 animate-spin text-brand" />
            <span className="text-[13.5px] font-medium text-sub">Locating route…</span>
          </>
        ) : (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-good-soft text-good">
              {stage === "enroute_pickup" ? <MapPin size={17} /> : <Navigation size={17} />}
            </span>
            <span>
              <span className="block text-[14.5px] font-semibold">
                {etaMin === 0 ? "Arriving now" : `${etaMin} min away`}
              </span>
              <span className="block text-[12.5px] text-sub">
                {stage === "enroute_pickup"
                  ? "Driver is heading to pickup"
                  : "Heading to drop-off"}
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
