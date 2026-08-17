import Link from "next/link";
import OnboardingStepHeader from "../OnboardingStepHeader";
import { Upload, ShieldCheck } from "@/components/Icons";

export default function PassengerVerifyStep() {
  return (
    <div>
      <OnboardingStepHeader
        step={2}
        total={4}
        title="ID Verification"
        back="/onboarding/passenger/personal"
      />
      <div className="px-4 pb-8">
        <div className="flex items-center gap-3 rounded-2xl border border-brand/15 bg-brand-soft px-4 py-3.5">
          <ShieldCheck size={20} className="shrink-0 text-brand" />
          <p className="text-[12.5px] leading-snug text-ink">
            Every rider and every partner is verified before they can request
            or accept a trip — it keeps both sides of the platform safe.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-sub">
              National ID — Front
            </label>
            <button className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white py-6 text-[13.5px] font-semibold text-sub">
              <Upload size={17} /> Upload front of ID
            </button>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">
              National ID — Back
            </label>
            <button className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white py-6 text-[13.5px] font-semibold text-sub">
              <Upload size={17} /> Upload back of ID
            </button>
          </div>
        </div>

        <Link
          href="/onboarding/passenger/contact"
          className="mt-8 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
