import { ScreenHeader } from "@/components/ui";
import WithdrawForm from "./WithdrawForm";

export default function WithdrawPage() {
  return (
    <div>
      <ScreenHeader title="Withdraw" back="/wallet" />
      <WithdrawForm />
    </div>
  );
}
