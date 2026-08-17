"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from "react-leaflet";
import L from "leaflet";

// Leaflet's default marker assets don't resolve under Next.js's bundler —
// use inline SVG divIcons instead, matching the app's brand pin styling.
function pinIcon(color: string, size = 34) {
  return L.divIcon({
    className: "",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.2" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))"><path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8z"/><circle cx="12" cy="10" r="3" fill="white" stroke="none"/></svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

function carIcon(color: string, size = 30) {
  return L.divIcon({
    className: "",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))"><circle cx="12" cy="12" r="11" fill="white"/><g transform="translate(12 12) scale(0.62) translate(-12 -12)"><path d="M4 16v-4l2-5a2 2 0 0 1 1.9-1.3h8.2A2 2 0 0 1 18 7l2 5v4" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.5 16h19" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/><circle cx="7.5" cy="16" r="1.6" fill="${color}"/><circle cx="16.5" cy="16" r="1.6" fill="${color}"/></g></svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const brandPin = pinIcon("#4f46e5");
const greenPin = pinIcon("#16a34a", 28);
const redPin = pinIcon("#dc2626", 28);
const vehicleIcon = carIcon("#4f46e5");

function CenterTracker({ onCenterChange }: { onCenterChange?: (lat: number, lon: number) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const c = map.getCenter();
      onCenterChange?.(c.lat, c.lng);
    },
  });
  return null;
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1]]);
  return null;
}

export type MapMarker = {
  position: [number, number];
  kind?: "pickup" | "dropoff" | "vehicle";
};

export default function LiveMap({
  center,
  zoom = 15,
  interactive = true,
  onCenterChange,
  markers = [],
  route,
  className = "",
  recenterKey,
}: {
  center: [number, number];
  zoom?: number;
  interactive?: boolean;
  onCenterChange?: (lat: number, lon: number) => void;
  markers?: MapMarker[];
  route?: [number, number][];
  className?: string;
  recenterKey?: string;
}) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        dragging={interactive}
        touchZoom={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        boxZoom={interactive}
        style={{ height: "100%", width: "100%" }}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {interactive && <CenterTracker onCenterChange={onCenterChange} />}
        {recenterKey !== undefined && <Recenter center={center} />}
        {route && route.length > 1 && (
          <Polyline positions={route} pathOptions={{ color: "#4f46e5", weight: 4, opacity: 0.85 }} />
        )}
        {markers.map((m, i) => (
          <Marker
            key={i}
            position={m.position}
            icon={
              m.kind === "pickup"
                ? greenPin
                : m.kind === "dropoff"
                  ? redPin
                  : m.kind === "vehicle"
                    ? vehicleIcon
                    : brandPin
            }
            zIndexOffset={m.kind === "vehicle" ? 1000 : 0}
          />
        ))}
      </MapContainer>
    </div>
  );
}
