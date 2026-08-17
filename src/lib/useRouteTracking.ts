"use client";

import { useEffect, useState } from "react";

type LatLon = [number, number];

function haversineKm(a: LatLon, b: LatLon): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function pointAtFraction(coords: LatLon[], fraction: number): LatLon {
  if (coords.length === 0) return [0, 0];
  if (coords.length === 1 || fraction <= 0) return coords[0];
  if (fraction >= 1) return coords[coords.length - 1];

  const segmentLengths: number[] = [];
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const len = haversineKm(coords[i], coords[i + 1]);
    segmentLengths.push(len);
    total += len;
  }
  if (total === 0) return coords[0];

  const targetDist = fraction * total;
  let covered = 0;
  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i];
    if (covered + segLen >= targetDist) {
      const segFraction = segLen === 0 ? 0 : (targetDist - covered) / segLen;
      const [lat1, lon1] = coords[i];
      const [lat2, lon2] = coords[i + 1];
      return [lat1 + (lat2 - lat1) * segFraction, lon1 + (lon2 - lon1) * segFraction];
    }
    covered += segLen;
  }
  return coords[coords.length - 1];
}

export function useRouteTracking(
  from: LatLon,
  to: LatLon,
  { demoSeconds = 25, active = true }: { demoSeconds?: number; active?: boolean } = {}
) {
  const [route, setRoute] = useState<LatLon[] | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProgress(0);

    fetch(`/api/route?fromLat=${from[0]}&fromLon=${from[1]}&toLat=${to[0]}&toLon=${to[1]}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.route) {
          setRoute(data.route.coordinates);
          setDurationMin(data.route.durationMin);
          setDistanceKm(data.route.distanceKm);
        } else {
          // graceful fallback: straight line, rough estimate from haversine
          const km = haversineKm(from, to);
          setRoute([from, to]);
          setDistanceKm(km);
          setDurationMin(Math.max(2, (km / 25) * 60)); // ~25 km/h urban assumption
        }
      })
      .catch(() => {
        if (cancelled) return;
        const km = haversineKm(from, to);
        setRoute([from, to]);
        setDistanceKm(km);
        setDurationMin(Math.max(2, (km / 25) * 60));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from[0], from[1], to[0], to[1]]);

  useEffect(() => {
    if (!route || loading || !active) return;
    const start = Date.now();

    // A plain setInterval, not requestAnimationFrame: each tick here
    // cascades into a Leaflet map.setView() call (TrackingMap recenters on
    // the vehicle), so updating at 60fps would mean 60 setView calls/sec —
    // visibly janky and needless, since a slow-moving marker over a
    // ~25s animation looks perfectly smooth updated a couple of times a
    // second.
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const frac = Math.min(1, elapsed / demoSeconds);
      setProgress(frac);
      if (frac >= 1) clearInterval(id);
    }, 400);

    return () => clearInterval(id);
  }, [route, loading, active, demoSeconds]);

  const position = route ? pointAtFraction(route, progress) : from;
  const etaMin =
    durationMin !== null ? Math.max(0, Math.ceil((1 - progress) * durationMin)) : null;

  return {
    position,
    etaMin,
    distanceKm,
    route: route ?? [],
    progress,
    loading,
    arrived: progress >= 1,
  };
}
