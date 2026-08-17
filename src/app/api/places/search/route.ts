import { NextRequest, NextResponse } from "next/server";

// Live place search via OpenStreetMap Nominatim — no API key required.
// Scoped to Zimbabwe (countrycodes=zw) since that's FastGo's market.
// Nominatim's usage policy caps this at ~1 req/sec and requires a real
// User-Agent; fine for a prototype, but a production deployment at real
// traffic should move to a paid provider (Google Places, Mapbox, HERE)
// or self-hosted Nominatim.

export type PlaceResult = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
};

type NominatimRow = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
};

async function nominatimSearch(q: string, near: [number, number] | null): Promise<NominatimRow[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "zw");
  url.searchParams.set("dedupe", "1");
  url.searchParams.set("limit", "8");

  if (near) {
    // Soft bias toward the active city (bounded=0 means "prefer, don't
    // exclude") — keeps results relevant to where the user actually is
    // instead of Nominatim's default whole-country ranking, and in
    // practice returns fewer, more useful rows faster.
    const [lat, lon] = near;
    const delta = 0.35; // roughly a 35-40km box around the city center
    url.searchParams.set("viewbox", `${lon - delta},${lat + delta},${lon + delta},${lat - delta}`);
    url.searchParams.set("bounded", "0");
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent": "FastGo-Prototype/0.1 (Zimbabwe ride-hailing app; dev contact via app support)",
      "Accept-Language": "en",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];
  return (await res.json()) as NominatimRow[];
}

// Nominatim's free-text matching is fairly literal: "NetOne Headquarters
// Harare" returns nothing (no OSM tag contains "Headquarters" near that
// POI) even though "NetOne Harare" finds it immediately. Rather than
// maintain a stoplist of every "Building"/"HQ"/"Branch"-style word people
// might type, progressively drop trailing words and retry — the core
// proper noun is almost always the first word(s), descriptive/geo suffixes
// are what's disposable.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function searchWithRelaxation(q: string, near: [number, number] | null): Promise<NominatimRow[]> {
  const words = q.split(/\s+/).filter(Boolean);
  for (let dropped = 0; dropped <= Math.min(3, words.length - 1); dropped++) {
    if (dropped > 0) await sleep(400); // stay under Nominatim's ~1 req/sec limit between retries
    const attempt = words.slice(0, words.length - dropped).join(" ");
    const rows = await nominatimSearch(attempt, near);
    if (rows.length > 0) return rows;
  }
  return [];
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] satisfies PlaceResult[] });
  }

  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "");
  const lon = parseFloat(req.nextUrl.searchParams.get("lon") ?? "");
  const near: [number, number] | null = Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;

  try {
    const raw = await searchWithRelaxation(q, near);

    const results: PlaceResult[] = raw.map((r) => {
      const parts = r.display_name.split(",").map((p) => p.trim());
      const name = r.name || parts[0];
      const address = parts.slice(1, 4).join(", ") || parts.slice(1).join(", ");
      return {
        id: String(r.place_id),
        name,
        address: address || r.display_name,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
      };
    });

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] satisfies PlaceResult[] });
  }
}
