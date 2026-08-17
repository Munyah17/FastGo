"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Navigation, Loader2 } from "@/components/Icons";
import { useCity } from "@/lib/CityContext";
import { savedPlaces } from "@/lib/data";
import type { PlaceResult } from "@/app/api/places/search/route";

type Field = "from" | "to";

export default function SearchFlow() {
  const router = useRouter();
  const { city } = useCity();
  const [from, setFrom] = useState("My Location");
  const [to, setTo] = useState("");
  const [active, setActive] = useState<Field>("to");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);

  const query = active === "from" ? from : to;

  useEffect(() => {
    const q = query.trim();
    if (!q || (active === "from" && q === "My Location")) {
      setResults([]);
      return;
    }
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places/search?q=${encodeURIComponent(q)}&lat=${city.center[0]}&lon=${city.center[1]}`
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [query, active]);

  const savedMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || (active === "from" && q === "my location")) return savedPlaces;
    return savedPlaces.filter(
      (p) =>
        p.label.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
    );
  }, [query, active]);

  const choose = (name: string) => {
    if (active === "from") {
      setFrom(name);
      setActive("to");
    } else {
      setTo(name);
      router.push("/book");
    }
  };

  const useCurrentLocation = () => {
    setFrom("My Location");
    setActive("to");
  };

  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col">
      <div className="px-4">
        <div className="rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-good" />
            <input
              value={from}
              onFocus={() => setActive("from")}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Pickup location"
              aria-label="Pickup location"
              className={`flex-1 bg-transparent text-[14px] outline-none placeholder:text-faint ${
                active === "from" ? "font-semibold text-ink" : "text-sub"
              }`}
            />
          </div>
          <div className="h-px bg-line" />
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-bad" />
            <input
              value={to}
              onFocus={() => setActive("to")}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Where to?"
              aria-label="Destination"
              autoFocus
              className={`flex-1 bg-transparent text-[14px] outline-none placeholder:text-faint ${
                active === "to" ? "font-semibold text-ink" : "text-sub"
              }`}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {active === "from" && (
            <button
              onClick={useCurrentLocation}
              className="flex flex-1 items-center gap-2 rounded-xl bg-brand-soft px-3.5 py-2.5 text-[13px] font-semibold text-brand"
            >
              <Navigation size={15} /> Use current location
            </button>
          )}
          <Link
            href={`/book/search/map?field=${active}`}
            className={`flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-semibold text-sub ${
              active === "from" ? "" : "flex-1"
            }`}
          >
            <MapPin size={15} /> Choose on map
          </Link>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-4 pb-6">
        {savedMatches.length > 0 && (
          <>
            <div className="mb-2 text-[11.5px] font-semibold uppercase tracking-wide text-faint">
              Saved
            </div>
            <div className="mb-4 divide-y divide-line rounded-2xl border border-line bg-white">
              {savedMatches.map((p) => (
                <button
                  key={p.label}
                  onClick={() => choose(p.label)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-page/60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <MapPin size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{p.label}</span>
                    <span className="block truncate text-[12px] text-sub">{p.address}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mb-2 flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-wide text-faint">
          <Search size={13} /> Live Results
          {loading && <Loader2 size={12} className="animate-spin text-brand" />}
        </div>
        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => choose(p.name)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-page/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-page text-sub">
                <MapPin size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{p.name}</span>
                <span className="block truncate text-[12px] text-sub">{p.address}</span>
              </span>
            </button>
          ))}
          {!loading && results.length === 0 && query.trim().length >= 2 && (
            <div className="px-4 py-6 text-center text-[13px] text-faint">
              No live matches. Try a different search.
            </div>
          )}
          {query.trim().length < 2 && (
            <div className="px-4 py-6 text-center text-[13px] text-faint">
              Type at least 2 characters to search real places in Zimbabwe.
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-[11px] text-faint">
          Places by OpenStreetMap contributors
        </p>
      </div>
    </div>
  );
}
