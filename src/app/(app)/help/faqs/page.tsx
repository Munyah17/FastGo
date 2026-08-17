import { ScreenHeader } from "@/components/ui";
import FaqList from "./FaqList";

export default function FaqsPage() {
  return (
    <div>
      <ScreenHeader title="FAQs" back="/help" />
      <FaqList />
    </div>
  );
}
