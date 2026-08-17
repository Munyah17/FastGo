import { ScreenHeader, Card, ListRow, Divider, Badge, PrimaryButton } from "@/components/ui";
import {
  ShieldCheck,
  Scale,
  Car,
  Shield,
  Headset,
  Doc,
} from "@/components/Icons";
import { insurance, fmt } from "@/lib/data";

const coverIcons = { scale: Scale, car: Car, shield: Shield, headset: Headset };

export default function ProtectionPage() {
  return (
    <div>
      <ScreenHeader title="Legal Aid Cover" back="/" />

      <div className="px-4 pb-6">
        <div className="flex flex-col items-center py-5 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-good text-white">
            <ShieldCheck size={34} />
          </span>
          <h2 className="mt-3 text-[18px] font-bold">
            You&apos;re Fully Covered
          </h2>
          <p className="text-[13.5px] text-sub">
            Legal Aid Cover <span className="text-faint">• Provided by Motions</span>
          </p>
          <Badge tone="good">Active</Badge>
        </div>

        <div className="mb-2 text-[13px] font-semibold text-sub">
          Your Cover
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

        <Card className="mt-3.5 flex items-center px-4 py-3.5">
          <span className="flex-1">
            <span className="block text-[12.5px] text-sub">
              Monthly Premium
            </span>
            <span className="block text-[17px] font-bold">
              {fmt(insurance.monthlyPremium)}
            </span>
            <span className="block text-[12px] text-sub">
              Next payment: {insurance.nextPayment}
            </span>
          </span>
          <Badge tone="good">Paid ✓</Badge>
        </Card>

        <Card className="mt-3.5">
          <ListRow
            href="/insurance"
            icon={<Doc size={17} />}
            title="Policy Documents"
            subtitle="View and download"
          />
        </Card>

        <PrimaryButton href="/safety" className="mt-4">
          Report an Incident
          <span className="block text-[11.5px] font-normal text-white/75">
            Get help immediately
          </span>
        </PrimaryButton>
      </div>
    </div>
  );
}
