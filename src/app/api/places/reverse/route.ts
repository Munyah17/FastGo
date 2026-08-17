import { NextRequest, NextResponse } from "next/server";

// Reverse geocoding for the map pin-drop picker — same keyless Nominatim
// source as /api/places/search.

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json({ name: "Dropped pin", address: "" });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("format", "jsonv2");

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FastGo-Prototype/0.1 (Zimbabwe ride-hailing app; dev contact via app support)",
        "Accept-Language": "en",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ name: "Dropped pin", address: "" });
    }

    const raw = (await res.json()) as { display_name?: string; name?: string };
    const parts = (raw.display_name ?? "").split(",").map((p) => p.trim());
    const name = raw.name || parts[0] || "Dropped pin";
    const address = parts.slice(1, 4).join(", ");

    return NextResponse.json({ name, address });
  } catch {
    return NextResponse.json({ name: "Dropped pin", address: "" });
  }
}
