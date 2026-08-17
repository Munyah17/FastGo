"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { ScreenHeader } from "@/components/ui";
import { useCity } from "@/lib/CityContext";
import { MapPin, Loader2 } from "@/components/Icons";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-page text-faint">
      <Loader2 size={24} className="animate-spin" />
    </div>
  ),
});

export default function ChooseOnMapContent() {
  const router = useRouter();
  const params = useSearchParams();
  const field = params.get("field") === "from" ? "from" : "to";
  const { city } = useCity();

  const [center, setCenter] = useState<[number, number]>(city.center);
  const [address, setAddress] = useState<{ name: string; address: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/places/reverse?lat=${center[0]}&lon=${center[1]}`);
        const data = await res.json();
        setAddress(data);
      } catch {
        setAddress({ name: "Dropped pin", address: "" });
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [center]);

  return (
    <div>
      <ScreenHeader title="Choose Location" back="/book/search" />
      <p className="px-4 pb-3 text-[13px] text-sub">
        Drag the map so the pin sits exactly on your {field === "from" ? "pickup" : "destination"}.
      </p>
      <div className="relative h-[52vh] min-h-[340px]">
        <LiveMap
          className="h-full w-full"
          center={city.center}
          zoom={16}
          onCenterChange={(lat, lon) => setCenter([lat, lon])}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-full">
          <MapPin size={40} className="text-brand drop-shadow-lg" />
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5">
          {loading ? (
            <Loader2 size={16} className="shrink-0 animate-spin text-brand" />
          ) : (
            <MapPin size={16} className="shrink-0 text-brand" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold">
              {loading ? "Finding address…" : address?.name ?? "Move the map to select"}
            </span>
            {address?.address && (
              <span className="block truncate text-[11.5px] text-sub">{address.address}</span>
            )}
          </span>
        </div>
        <button
          disabled={loading || !address}
          onClick={() => router.push("/book")}
          className="w-full rounded-xl bg-brand py-3.5 text-[15px] font-bold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          Confirm This Location
        </button>
      </div>
    </div>
  );
}
