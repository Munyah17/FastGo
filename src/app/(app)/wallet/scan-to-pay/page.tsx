import { ScreenHeader } from "@/components/ui";
import ScanToPayHub from "./ScanToPayHub";

export default function ScanToPayPage() {
  return (
    <div>
      <ScreenHeader title="Scan to Pay" back="/wallet" />
      <ScanToPayHub />
    </div>
  );
}
