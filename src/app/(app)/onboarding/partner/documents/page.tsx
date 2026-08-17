import Link from "next/link";
import OnboardingStepHeader from "../OnboardingStepHeader";
import { Card } from "@/components/ui";
import { Upload, Doc } from "@/components/Icons";

const docs = [
  { name: "Vehicle Registration", hint: "Book of entry / registration book" },
  { name: "Roadworthy Certificate", hint: "Current inspection certificate" },
  { name: "COE / PSV Badge", hint: "Certificate of Entitlement / Badge" },
];

export default function VehicleDocumentsStep() {
  return (
    <div>
      <OnboardingStepHeader
        step={4}
        total={6}
        title="Vehicle Documents"
        back="/onboarding/partner/vehicle"
      />
      <div className="px-4 pb-8">
        <p className="text-[13.5px] text-sub">
          Upload each document below. We&apos;ll verify these and let you
          know if anything needs renewing.
        </p>

        <Card className="mt-4">
          {docs.map((d, i) => (
            <div key={d.name}>
              {i > 0 && <div className="mx-4 h-px bg-line" />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-page text-sub">
                  <Doc size={16} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-medium">{d.name}</span>
                  <span className="block text-[12px] text-sub">{d.hint}</span>
                </span>
                <button className="flex items-center gap-1.5 rounded-lg bg-brand-soft px-3 py-1.5 text-[12.5px] font-semibold text-brand">
                  <Upload size={13} /> Upload
                </button>
              </div>
            </div>
          ))}
        </Card>

        <Link
          href="/onboarding/partner/insurance"
          className="mt-8 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
