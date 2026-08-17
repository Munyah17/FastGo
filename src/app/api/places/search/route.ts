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

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] satisfies PlaceResult[] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "zw");
  url.searchParams.set("limit", "8");

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FastGo-Prototype/0.1 (Zimbabwe ride-hailing app; dev contact via app support)",
        "Accept-Language": "en",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] satisfies PlaceResult[] });
    }

    const raw = (await res.json()) as Array<{
      place_id: number;
      display_name: string;
      lat: string;
      lon: string;
      name?: string;
      address?: Record<string, string>;
    }>;

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
