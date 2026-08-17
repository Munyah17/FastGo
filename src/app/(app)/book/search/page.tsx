import { ScreenHeader } from "@/components/ui";
import SearchFlow from "./SearchFlow";

export default function SearchPage() {
  return (
    <div>
      <ScreenHeader title="Set Your Route" back="/" />
      <SearchFlow />
    </div>
  );
}
