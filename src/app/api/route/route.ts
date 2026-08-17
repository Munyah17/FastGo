import { NextRequest, NextResponse } from "next/server";

// Driving route between two points, via OSRM's free public demo server —
// no API key required. Returns real road-following geometry + a realistic
// duration/distance estimate, which the trip-tracking screens use for the
// "X min away" readout and the vehicle-animation path.
//
// Public demo server — fine for a prototype, not for production traffic.
// A real deployment should run self-hosted OSRM or a paid routing API
// (Mapbox Directions, Google Directions, HERE).

export type RouteResult = {
  coordinates: [number, number][]; // [lat, lon] pairs
  distanceKm: number;
  durationMin: number;
};

export async function GET(req: NextRequest) {
  const fromLat = req.nextUrl.searchParams.get("fromLat");
  const fromLon = req.nextUrl.searchParams.get("fromLon");
  const toLat = req.nextUrl.searchParams.get("toLat");
  const toLon = req.nextUrl.searchParams.get("toLon");

  if (!fromLat || !fromLon || !toLat || !toLon) {
    return NextResponse.json({ route: null }, { status: 400 });
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return NextResponse.json({ route: null });

    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return NextResponse.json({ route: null });

    const coordinates: [number, number][] = route.geometry.coordinates.map(
      ([lon, lat]: [number, number]) => [lat, lon]
    );

    const result: RouteResult = {
      coordinates,
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60,
    };

    return NextResponse.json({ route: result });
  } catch {
    return NextResponse.json({ route: null });
  }
}
