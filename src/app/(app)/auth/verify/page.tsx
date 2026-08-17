import { ScreenHeader } from "@/components/ui";
import OtpForm from "./OtpForm";

export default function VerifyPage() {
  return (
    <div>
      <ScreenHeader title="Verification" back="/auth" />
      <div className="px-6">
        <h1 className="text-[22px] font-bold">Enter the code</h1>
        <p className="mt-1 text-[14px] text-sub">
          We sent a 6-digit code by SMS to{" "}
          <span className="font-semibold text-ink">+263 77 123 4567</span>.
        </p>
        <OtpForm />
      </div>
    </div>
  );
}
