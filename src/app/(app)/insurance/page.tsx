import Link from "next/link";
import { ScreenHeader, Card, ListRow, Divider, Badge } from "@/components/ui";
import {
  Info,
  ShieldCheck,
  Scale,
  Car,
  Shield,
  Headset,
  Doc,
} from "@/components/Icons";
import { insurance, fmt } from "@/lib/data";

const coverIcons = { scale: Scale, car: Car, shield: Shield, headset: Headset };

export default function InsurancePage() {
  return (
    <div>
      <ScreenHeader
        title="Legal Aid Cover"
        back="/profile"
        right={
          <button aria-label="About Legal Aid Cover" className="text-sub">
            <Info size={19} />
          </button>
        }
      />

      <div className="px-4 pb-6">
        <Card className="flex items-center gap-3 border-good/15 bg-good-soft px-4 py-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-good text-white">
            <ShieldCheck size={24} />
          </span>
          <span>
            <span className="block text-[15px] font-bold">
              You&apos;re Fully Covered
            </span>
            <span className="block text-[12.5px] leading-snug text-sub">
              Your Legal Aid Cover is active and up to date.
            </span>
          </span>
        </Card>

        <Card className="mt-3.5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[14.5px] font-semibold">Current Cover</span>
            <span className="text-[12.5px] font-semibold text-good">
              Active
            </span>
          </div>
          <div className="mt-3 space-y-3 text-[13.5px]">
            <div>
              <div className="text-[11.5px] text-faint">Policy Number</div>
              <div className="font-semibold">{insurance.policyNumber}</div>
            </div>
            <div>
              <div className="text-[11.5px] text-faint">Cover Period</div>
              <div className="font-semibold">{insurance.coverPeriod}</div>
            </div>
            <div>
              <div className="text-[11.5px] text-faint">Next Payment</div>
              <div className="font-semibold">{insurance.nextPayment}</div>
            </div>
          </div>
          <div className="mt-3.5 border-t border-line pt-3">
            <ListRow
              href="/protection"
              icon={<Shield size={17} />}
              title="View Policy Details"
            />
          </div>
        </Card>

        <div className="mb-2 mt-5 text-[15px] font-semibold">
          What&apos;s Covered
        </div>
        <Card>
          {insurance.covered.map((item, i) => {
            const Icon = coverIcons[item.icon as keyof typeof coverIcons];
            return (
              <div key={item.title}>
                {i > 0 && <Divider />}
                <ListRow
                  icon={<Icon size={17} />}
                  title={item.title}
                  subtitle={item.subtitle}
                />
              </div>
            );
          })}
        </Card>

        <Card className="mt-3.5 flex items-center justify-between border-good/15 bg-good-soft px-4 py-3.5">
          <span className="text-[13.5px] font-medium">
            Monthly Premium: {fmt(insurance.monthlyPremium)}
          </span>
          <Badge tone="good">Paid ✓</Badge>
        </Card>

        <Link
          href="/insurance/pay"
          className="mt-4 block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Pay Premium
        </Link>

        <div className="mb-2 mt-5 text-[15px] font-semibold">
          Billing History
        </div>
        <Card>
          {insurance.billingHistory.map((b, i) => (
            <div key={b.period}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-page text-sub">
                  <Doc size={16} />
                </span>
                <span className="flex-1">
                  <span className="block text-[13.5px] font-medium">
                    {b.period}
                  </span>
                  <span className="block text-[12px] text-sub">
                    Paid {b.date} • {b.method}
                  </span>
                </span>
                <span className="text-[13.5px] font-bold">{fmt(b.amount)}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
