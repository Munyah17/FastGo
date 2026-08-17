import Link from "next/link";
import OnboardingStepHeader from "../OnboardingStepHeader";
import { Upload } from "@/components/Icons";

export default function PassengerPersonalStep() {
  return (
    <div>
      <OnboardingStepHeader
        step={1}
        total={4}
        title="Personal Information"
        back="/profile"
      />
      <div className="px-4 pb-8">
        <p className="text-[13.5px] text-sub">
          Passengers go through the same identity verification as partners.
          This protects drivers too, not just riders.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-sub">Full Name</label>
            <input
              defaultValue="Tawanda Moyo"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">
              National ID Number
            </label>
            <input
              placeholder="63-123456A78"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none placeholder:text-faint focus:border-brand"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">
              Phone Number
            </label>
            <input
              defaultValue="+263 77 123 4567"
              disabled
              className="mt-1.5 w-full rounded-xl border border-line bg-page px-4 py-3 text-[14.5px] text-sub outline-none"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">
              Selfie Photo
            </label>
            <button className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white py-6 text-[13.5px] font-semibold text-sub">
              <Upload size={17} /> Upload a clear selfie
            </button>
          </div>
        </div>

        <Link
          href="/onboarding/passenger/verify"
          className="mt-8 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
