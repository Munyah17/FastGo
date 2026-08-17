import { ScreenHeader } from "@/components/ui";
import PayPremiumForm from "./PayPremiumForm";

export default function PayPremiumPage() {
  return (
    <div>
      <ScreenHeader title="Pay Premium" back="/insurance" />
      <PayPremiumForm />
    </div>
  );
}
