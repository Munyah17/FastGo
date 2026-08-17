import MapMock from "@/components/MapMock";
import { ScreenHeader, Card } from "@/components/ui";
import { Swap } from "@/components/Icons";
import RideOptions from "./RideOptions";

export default function BookPage() {
  return (
    <div>
      <ScreenHeader title="Book a Ride" back="/" />

      <div className="relative">
        <MapMock className="h-56" />
        <Card className="absolute inset-x-4 -bottom-10 flex items-center gap-3 px-4 py-3 shadow-lg">
          <div className="flex flex-col items-center gap-1 py-1">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-brand" />
            <span className="h-6 w-px border-l border-dashed border-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-bad" />
          </div>
          <div className="flex-1">
            <div className="pb-2">
              <div className="text-[11px] text-faint">From</div>
              <div className="text-[14px] font-medium">My Location</div>
            </div>
            <div className="border-t border-line pt-2">
              <div className="text-[11px] text-faint">To</div>
              <div className="text-[14px] font-medium">
                Sam Levy&apos;s Village
              </div>
            </div>
          </div>
          <button
            aria-label="Swap pickup and destination"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sub"
          >
            <Swap size={16} />
          </button>
        </Card>
      </div>

      <div className="h-12" />
      <RideOptions />
    </div>
  );
}
