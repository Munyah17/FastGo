import { ScreenHeader } from "@/components/ui";
import TransactionsView from "./TransactionsView";

export default function TransactionsPage() {
  return (
    <div>
      <ScreenHeader title="Wallet" back="/wallet" />
      <TransactionsView />
    </div>
  );
}
