import { ScreenHeader, Card, Badge, PrimaryButton } from "@/components/ui";
import MapMock from "@/components/MapMock";
import { tripHistory, fmt } from "@/lib/data";

export default async function TripDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const trip = tripHistory.find((t) => t.id === id) ?? tripHistory[0];
  const completed = trip.status === "Completed";

  return (
    <div>
      <ScreenHeader title="Trip Details" back="/trips" />
      <MapMock className="h-44" />
      <div className="px-4 pb-6">
        <Card className="-mt-6 px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-sub">
              {trip.id} • {trip.day}, {trip.time}
            </span>
            <Badge tone={completed ? "good" : "bad"}>{trip.status}</Badge>
          </div>
          <div className="mt-3 flex gap-3">
            <div className="flex flex-col items-center gap-1 pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-good" />
              <span className="h-7 w-px border-l border-dashed border-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-bad" />
            </div>
            <div className="flex-1">
              <div className="pb-2.5">
                <div className="text-[11px] text-faint">Pickup</div>
                <div className="text-[14px] font-medium">{trip.from}</div>
              </div>
              <div className="border-t border-line pt-2.5">
                <div className="text-[11px] text-faint">Drop-off</div>
                <div className="text-[14px] font-medium">{trip.to}</div>
              </div>
            </div>
          </div>
        </Card>

        {completed && (
          <>
            <Card className="mt-3.5 flex divide-x divide-line py-3.5 text-center">
              <div className="flex-1">
                <div className="text-[12px] text-sub">You Earned</div>
                <div className="text-[15.5px] font-bold">{fmt(trip.fare)}</div>
              </div>
              <div className="flex-1">
                <div className="text-[12px] text-sub">Distance</div>
                <div className="text-[15.5px] font-bold">{trip.distance}</div>
              </div>
              <div className="flex-1">
                <div className="text-[12px] text-sub">Duration</div>
                <div className="text-[15.5px] font-bold">{trip.duration}</div>
              </div>
            </Card>

            <Card className="mt-3.5 px-4 py-4 text-[13.5px]">
              <div className="flex justify-between py-1">
                <span className="text-sub">Passenger</span>
                <span className="font-semibold">{trip.passenger}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sub">Paid via</span>
                <span className="font-semibold">{trip.payment}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-line pt-2.5">
                <span className="font-semibold">Total Fare</span>
                <span className="text-[15px] font-bold">{fmt(trip.fare)}</span>
              </div>
            </Card>

            <PrimaryButton href="/help" className="mt-4">
              Get Help With This Trip
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}
