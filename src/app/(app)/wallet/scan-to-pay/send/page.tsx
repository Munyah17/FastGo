import { Suspense } from "react";
import { ScreenHeader } from "@/components/ui";
import SendToUserFlow from "./SendToUserFlow";

export default function ScanToPaySendPage() {
  return (
    <div>
      <ScreenHeader title="Send" back="/wallet/scan-to-pay" />
      <Suspense fallback={null}>
        <SendToUserFlow />
      </Suspense>
    </div>
  );
}
