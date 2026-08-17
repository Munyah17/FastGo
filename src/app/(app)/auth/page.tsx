import { ScreenHeader } from "@/components/ui";
import PhoneForm from "./PhoneForm";

export default function AuthPage() {
  return (
    <div>
      <ScreenHeader title="" back="/onboarding" />
      <div className="px-6">
        <div className="text-[26px] font-extrabold tracking-tight">
          Fast<span className="text-brand">Go</span>
        </div>
        <h1 className="mt-4 text-[22px] font-bold">Welcome</h1>
        <p className="mt-1 text-[14px] text-sub">
          Enter your phone number to sign in or create an account.
        </p>
        <PhoneForm />
      </div>
    </div>
  );
}
