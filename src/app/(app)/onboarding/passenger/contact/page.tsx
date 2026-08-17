import Link from "next/link";
import OnboardingStepHeader from "../OnboardingStepHeader";

export default function PassengerContactStep() {
  return (
    <div>
      <OnboardingStepHeader
        step={3}
        total={4}
        title="Emergency Contact"
        back="/onboarding/passenger/verify"
      />
      <div className="px-4 pb-8">
        <p className="text-[13.5px] text-sub">
          Shared with your trusted contact only if you trigger SOS or share a
          trip. Never visible to your driver.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-sub">Contact Name</label>
            <input
              placeholder="e.g. Rudo Moyo"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none placeholder:text-faint focus:border-brand"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">Phone Number</label>
            <input
              placeholder="+263 77 234 5678"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none placeholder:text-faint focus:border-brand"
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-sub">Relationship</label>
            <input
              placeholder="e.g. Spouse, Sibling, Friend"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] outline-none placeholder:text-faint focus:border-brand"
            />
          </div>
        </div>

        <Link
          href="/onboarding/passenger/review"
          className="mt-8 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
