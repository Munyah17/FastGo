import { ScreenHeader } from "@/components/ui";
import IncentivesView from "./IncentivesView";

export default function IncentivesPage() {
  return (
    <div>
      <ScreenHeader title="Incentives" back="/wallet" />
      <IncentivesView />
    </div>
  );
}
