"use client";

import { createContext, useContext, useState } from "react";

export type City = {
  name: string;
  slug: string;
  center: [number, number];
};

// Matches the launch councils seeded in supabase/seed.sql.
export const KNOWN_CITIES: City[] = [
  { name: "Harare", slug: "harare", center: [-17.8252, 31.0335] },
  { name: "Bulawayo", slug: "bulawayo", center: [-20.15, 28.5844] },
  { name: "Chitungwiza", slug: "chitungwiza", center: [-18.0127, 31.0756] },
  { name: "Mutare", slug: "mutare", center: [-18.9707, 32.6709] },
  { name: "Gweru", slug: "gweru", center: [-19.45, 29.8167] },
  { name: "Victoria Falls", slug: "victoria-falls", center: [-17.9243, 25.8572] },
];

const CityContext = createContext<{
  city: City;
  setCity: (c: City) => void;
} | null>(null);

const STORAGE_KEY = "fastgo-city";

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState<City>(() => {
    if (typeof window === "undefined") return KNOWN_CITIES[0];
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return KNOWN_CITIES.find((c) => c.slug === stored) ?? KNOWN_CITIES[0];
  });

  const setCity = (c: City) => {
    setCityState(c);
    window.localStorage.setItem(STORAGE_KEY, c.slug);
  };

  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within a CityProvider");
  return ctx;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestKnownCity(point: [number, number]): { city: City; distanceKm: number } {
  let best = KNOWN_CITIES[0];
  let bestDist = haversineKm(point, best.center);
  for (const c of KNOWN_CITIES.slice(1)) {
    const d = haversineKm(point, c.center);
    if (d < bestDist) {
      best = c;
      bestDist = d;
    }
  }
  return { city: best, distanceKm: bestDist };
}
