import Link from "next/link";
import { Card } from "@/components/ui";
import Avatar from "@/components/Avatar";
import {
  ChevronDown,
  Shield,
  Star,
  Phone,
  Chat,
  ShieldCheck,
} from "@/components/Icons";
import { activeRide, driverOffers, fmt } from "@/lib/data";
import RideTrackingMap from "./RideTrackingMap";
import ShareTripButton from "./ShareTripButton";

export default async function RidePage({
  searchParams,
}: {
  searchParams: Promise<{ offer?: string }>;
}) {
  const { offer } = await searchParams;
  const picked = driverOffers.find((o) => o.id === offer);

  const driver = picked
    ? { name: picked.name, rating: picked.rating, phone: picked.phone }
    : activeRide.driver;
  const vehicleLabel = picked ? picked.vehicle : `${activeRide.vehicle.model} • ${activeRide.vehicle.colour}`;
  const plate = picked ? picked.vehicle.split("•").pop()?.trim() : activeRide.vehicle.plate;
  const fare = picked ? picked.fare : activeRide.fare;

  return (
    <div>
      <header className="sticky top-0 z-20 flex items-center justify-between bg-page/95 px-4 py-4 backdrop-blur">
        <Link
          href="/book"
          aria-label="Collapse"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white"
        >
          <ChevronDown size={22} />
        </Link>
        <h1 className="text-[17px] font-semibold">Active Ride</h1>
        <Link
          href="/safety"
          aria-label="Safety"
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand hover:bg-white"
        >
          <Shield size={20} />
        </Link>
      </header>

      <RideTrackingMap pickup={activeRide.pickup} dropoff={activeRide.dropoff} />

      <div className="px-4 pb-6">
        <Card className="mt-4 flex items-center gap-3 px-4 py-3.5">
          <Avatar name={driver.name} size={44} className="text-[15px]" />
          <span className="flex-1">
            <span className="flex items-center gap-1.5 text-[14.5px] font-semibold">
              {driver.name}
              <Star size={13} className="text-amber-400" />
              <span className="text-[12.5px] font-medium text-sub">
                {driver.rating}
              </span>
            </span>
            <span className="block text-[12.5px] text-sub">{vehicleLabel}</span>
            {plate && (
              <span className="mt-0.5 inline-block rounded-md bg-page px-1.5 py-0.5 text-[11.5px] font-bold tracking-wider">
                {plate}
              </span>
            )}
          </span>
          <span className="flex gap-2">
            <a
              href={`tel:${driver.phone}`}
              aria-label="Call driver"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-sub"
            >
              <Phone size={17} />
            </a>
            <Link
              href="/messages/chat"
              aria-label="Message driver"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white"
            >
              <Chat size={17} />
            </Link>
          </span>
        </Card>

        <Card className="mt-3 px-4 py-3.5">
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1 pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-good" />
              <span className="h-7 w-px border-l border-dashed border-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-bad" />
            </div>
            <div className="flex-1">
              <div className="pb-2.5">
                <div className="text-[11px] text-faint">Pickup</div>
                <div className="text-[14px] font-medium">{activeRide.pickup}</div>
              </div>
              <div className="flex items-end justify-between border-t border-line pt-2.5">
                <div>
                  <div className="text-[11px] text-faint">Drop-off</div>
                  <div className="text-[14px] font-medium">{activeRide.dropoff}</div>
                </div>
                <ShareTripButton
                  driverName={driver.name}
                  pickup={activeRide.pickup}
                  dropoff={activeRide.dropoff}
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex border-t border-line pt-3">
            <div className="flex-1">
              <div className="text-[11px] text-faint">Fare</div>
              <div className="text-[15px] font-bold">{fmt(fare)}</div>
            </div>
            <div className="flex-1 text-right">
              <div className="text-[11px] text-faint">Payment</div>
              <div className="text-[14px] font-medium">{activeRide.payment}</div>
            </div>
          </div>
        </Card>

        <Link
          href="/safety"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand/30 bg-white py-3 text-[14.5px] font-semibold text-brand"
        >
          <ShieldCheck size={18} /> Safety Tools
        </Link>
        <Link
          href="/"
          className="mt-2.5 block w-full rounded-xl bg-bad py-3.5 text-center text-[14.5px] font-semibold text-white transition-colors hover:bg-red-700"
        >
          Cancel Ride
        </Link>
      </div>
    </div>
  );
}
