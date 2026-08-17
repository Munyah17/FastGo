import Link from "next/link";
import OnboardingStepHeader from "../OnboardingStepHeader";
import { Upload } from "@/components/Icons";

export default function LicenseStep() {
  return (
    <div>
      <OnboardingStepHeader
        step={2}
        total={6}
        title="Driver's License"
        back="/onboarding/partner/personal"
      />
      <div className="px-4 pb-8">
        <p className="text-[13.5px] text-sub">
          A valid class 4 (or higher) licence is required before you can
          share rides on FastGo.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-sub">
              Licence Number
            </label>
            <input
              placeholder="e.g. 12345678A12"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none placeholder:text-faint focus:border-brand"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[13px] font-semibold text-sub">Class</label>
              <select className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none focus:border-brand">
                <option>Class 4</option>
                <option>Class 2</option>
                <option>Class 1</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[13px] font-semibold text-sub">
                Expiry Date
              </label>
              <input
                type="date"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none focus:border-brand"
              />
            </div>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">
              Licence Photo
            </label>
            <button className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white py-6 text-[13.5px] font-semibold text-sub">
              <Upload size={17} /> Upload front &amp; back
            </button>
          </div>
        </div>

        <Link
          href="/onboarding/partner/vehicle"
          className="mt-8 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
