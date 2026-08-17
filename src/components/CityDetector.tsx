"use client";

import { useEffect, useState } from "react";
import { useCity, nearestKnownCity, type City } from "@/lib/CityContext";
import { MapPin } from "@/components/Icons";

const DISMISS_KEY = "fastgo-city-prompt-dismissed";
// Beyond this, the nearest known city is probably not actually where the
// user is (e.g. testing from outside Zimbabwe) — don't prompt.
const MAX_PROMPT_DISTANCE_KM = 80;

export default function CityDetector() {
  const { city, setCity } = useCity();
  const [suggestion, setSuggestion] = useState<City | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const point: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        const { city: nearest, distanceKm } = nearestKnownCity(point);
        if (nearest.slug !== city.slug && distanceKm <= MAX_PROMPT_DISTANCE_KM) {
          setSuggestion(nearest);
        }
      },
      () => {
        // permission denied or unavailable — silently stay on the current city
      },
      { timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
    // Only run once per app load — city changes afterward are user-driven.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!suggestion) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setSuggestion(null);
  };

  return (
    <div className="absolute inset-x-3 top-[72px] z-30 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
        <MapPin size={17} />
      </span>
      <span className="flex-1 text-[12.5px] leading-snug">
        You seem to be in <span className="font-semibold">{suggestion.name}</span>. Switch the
        map to this location? Keeps things faster and more relevant.
      </span>
      <span className="flex shrink-0 flex-col gap-1.5">
        <button
          onClick={() => {
            setCity(suggestion);
            setSuggestion(null);
          }}
          className="rounded-lg bg-brand px-3 py-1.5 text-[11.5px] font-bold text-white"
        >
          Switch
        </button>
        <button onClick={dismiss} className="text-[11px] font-medium text-faint">
          Not now
        </button>
      </span>
    </div>
  );
}
