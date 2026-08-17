import { Card } from "@/components/ui";
import { CheckCircle } from "@/components/Icons";
import { fmt, activeRide } from "@/lib/data";
import RateTrip from "./RateTrip";

export default function TripCompletePage() {
  return (
    <div>
      <div className="flex flex-col items-center px-4 pt-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-good-soft text-good">
          <CheckCircle size={36} />
        </span>
        <h1 className="mt-3 text-[20px] font-bold">Trip Complete</h1>
        <p className="text-[13.5px] text-sub">
          {activeRide.pickup} → {activeRide.dropoff}
        </p>
      </div>

      <div className="px-4">
        <Card className="mt-4 flex divide-x divide-line py-3.5 text-center">
          <div className="flex-1">
            <div className="text-[12px] text-sub">Fare</div>
            <div className="text-[15.5px] font-bold">{fmt(activeRide.fare)}</div>
          </div>
          <div className="flex-1">
            <div className="text-[12px] text-sub">Distance</div>
            <div className="text-[15.5px] font-bold">6.8 km</div>
          </div>
          <div className="flex-1">
            <div className="text-[12px] text-sub">Time</div>
            <div className="text-[15.5px] font-bold">14 min</div>
          </div>
        </Card>
      </div>

      <RateTrip />
    </div>
  );
}
