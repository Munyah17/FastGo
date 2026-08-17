import { PageHeader } from "../ui";
import CouncilRules from "./CouncilRules";

export default function CouncilsPage() {
  return (
    <div>
      <PageHeader
        title="Councils & Rules"
        subtitle="Per-council operating rules read by the dispatch/compliance engine: configuration, not code"
      />
      <CouncilRules />
    </div>
  );
}
