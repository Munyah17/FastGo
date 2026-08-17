import { ScreenHeader } from "@/components/ui";
import TopupForm from "./TopupForm";

export default function TopupPage() {
  return (
    <div>
      <ScreenHeader title="Top Up Wallet" back="/wallet" />
      <TopupForm />
    </div>
  );
}
