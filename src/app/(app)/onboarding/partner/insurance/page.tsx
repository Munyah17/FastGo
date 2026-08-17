import Link from "next/link";
import OnboardingStepHeader from "../OnboardingStepHeader";
import { Card } from "@/components/ui";
import { Scale, Car, Shield, Headset } from "@/components/Icons";
import { insurance, fmt } from "@/lib/data";

const coverIcons = { scale: Scale, car: Car, shield: Shield, headset: Headset };

export default function InsuranceStep() {
  return (
    <div>
      <OnboardingStepHeader
        step={5}
        total={6}
        title="Legal Aid Cover"
        back="/onboarding/partner/documents"
      />
      <div className="px-4 pb-8">
        <p className="text-[13.5px] text-sub">
          Every FastGo partner is covered by Motions Legal Aid Cover — legal
          aid and comprehensive cover from day one.
        </p>

        <Card className="mt-4">
          {insurance.covered.map((item, i) => {
            const Icon = coverIcons[item.icon as keyof typeof coverIcons];
            return (
              <div key={item.title}>
                {i > 0 && <div className="mx-4 h-px bg-line" />}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Icon size={17} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[14px] font-medium">
                      {item.title}
                    </span>
                    <span className="block text-[12.5px] text-sub">
                      {item.subtitle}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </Card>

        <Card className="mt-3.5 flex items-center justify-between px-4 py-3.5">
          <span>
            <span className="block text-[12.5px] text-sub">
              Monthly Premium
            </span>
            <span className="block text-[17px] font-bold">
              {fmt(insurance.monthlyPremium)}
            </span>
          </span>
          <span className="text-right text-[12px] text-sub">
            Billed to your
            <br />
            FastGo Wallet
          </span>
        </Card>

        <Link
          href="/onboarding/partner/review"
          className="mt-8 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Activate Cover &amp; Continue
        </Link>
      </div>
    </div>
  );
}
