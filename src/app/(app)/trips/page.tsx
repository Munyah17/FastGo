import { ScreenHeader } from "@/components/ui";
import TripHistoryView from "./TripHistoryView";

export default function TripsPage() {
  return (
    <div>
      <ScreenHeader title="Trip History" back="/profile" />
      <TripHistoryView />
    </div>
  );
}
