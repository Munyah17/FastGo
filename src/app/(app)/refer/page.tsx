import { ScreenHeader } from "@/components/ui";
import ReferView from "./ReferView";

export default function ReferPage() {
  return (
    <div>
      <ScreenHeader title="Refer & Earn" back="/profile" />
      <ReferView />
    </div>
  );
}
