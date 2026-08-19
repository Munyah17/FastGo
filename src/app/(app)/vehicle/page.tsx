import { ScreenHeader, Card, Divider, Badge } from "@/components/ui";
import { Doc, Plus } from "@/components/Icons";
import { vehicle, vehicleDocuments, vehicleDesignations } from "@/lib/data";

export default function VehiclePage() {
  const designation = vehicleDesignations.find((d) => d.id === vehicle.designation);

  return (
    <div>
      <ScreenHeader title="My Vehicle" back="/profile" />

      <div className="px-4 pb-6">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4">
            <span>
              <span className="block text-[16px] font-bold">
                {vehicle.make} {vehicle.model}
              </span>
              <span className="block text-[12.5px] text-sub">
                {vehicle.colour} • {vehicle.plate}
              </span>
            </span>
            <Badge tone="good">{vehicle.status}</Badge>
          </div>

          {designation && (
            <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2">
              <span className="text-[12.5px] font-semibold text-brand">
                {designation.label}
              </span>
              <span className="text-[11.5px] text-brand/80">
                {designation.seats > 0 ? `${designation.seats} seats` : "Parcels only"}
              </span>
            </div>
          )}

          <div className="mt-3 flex h-28 items-center justify-center bg-page">
            <svg viewBox="0 0 140 70" className="h-20 w-40" aria-hidden="true">
              <ellipse cx="70" cy="60" rx="55" ry="6" fill="#e5e7eb" />
              <path
                d="M15 45 L25 22 Q30 15 40 15 L100 15 Q110 15 115 22 L125 45 Z"
                fill="#c7cad1"
              />
              <path
                d="M40 18 L48 30 H92 L100 18 Z"
                fill="#eef0f4"
                stroke="#9ca3af"
                strokeWidth="1"
              />
              <rect x="15" y="45" width="110" height="10" rx="3" fill="#9ca3af" />
              <circle cx="38" cy="56" r="10" fill="#374151" />
              <circle cx="38" cy="56" r="4" fill="#d1d5db" />
              <circle cx="102" cy="56" r="10" fill="#374151" />
              <circle cx="102" cy="56" r="4" fill="#d1d5db" />
            </svg>
          </div>
        </Card>

        <div className="mb-2 mt-5 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Vehicle Documents</h2>
          <Badge tone="good">All Valid</Badge>
        </div>
        <Card>
          {vehicleDocuments.map((doc, i) => (
            <div key={doc.name}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Doc size={16} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-medium">{doc.name}</span>
                  <span className="block text-[12.5px] text-sub">
                    Expires {doc.expires}
                  </span>
                </span>
                <Badge tone="good">{doc.status}</Badge>
              </div>
            </div>
          ))}
        </Card>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white py-3.5 text-[14px] font-semibold text-sub">
          <Plus size={17} /> Add / Update Document
        </button>
      </div>
    </div>
  );
}
