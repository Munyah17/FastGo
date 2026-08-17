import { ScreenHeader } from "@/components/ui";
import ReportForm from "./ReportForm";

export default function ReportIncidentPage() {
  return (
    <div>
      <ScreenHeader title="Report an Incident" back="/safety" />
      <ReportForm />
    </div>
  );
}
