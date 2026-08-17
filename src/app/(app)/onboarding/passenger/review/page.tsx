import Link from "next/link";
import OnboardingStepHeader from "../OnboardingStepHeader";
import { Card } from "@/components/ui";
import { user } from "@/lib/data";

export default function PassengerReviewStep() {
  return (
    <div>
      <OnboardingStepHeader
        step={4}
        total={4}
        title="Review & Submit"
        back="/onboarding/passenger/contact"
      />
      <div className="px-4 pb-8">
        <p className="text-[13.5px] text-sub">
          Double-check everything below, then submit for verification. Most
          checks complete within 24 hours.
        </p>

        <Card className="mt-4 px-4 py-4 text-[13.5px]">
          <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-faint">
            Personal
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sub">Name</span>
            <span className="font-semibold">{user.name}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sub">Phone</span>
            <span className="font-semibold">+263 77 123 4567</span>
          </div>
        </Card>

        <Card className="mt-3 px-4 py-4 text-[13.5px]">
          <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-faint">
            Identity
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sub">National ID</span>
            <span className="font-semibold">Uploaded</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sub">Emergency Contact</span>
            <span className="font-semibold">Added</span>
          </div>
        </Card>

        <Link
          href="/verification/passenger"
          className="mt-8 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Submit for Verification
        </Link>
      </div>
    </div>
  );
}
