import { ScreenHeader, Card, Divider } from "@/components/ui";
import { User, Doc, Users, ShieldCheck, Shield } from "@/components/Icons";

const steps = [
  {
    title: "Identity Verified",
    subtitle: "ID number, selfie",
    icon: User,
    state: "done",
  },
  {
    title: "National ID Document",
    subtitle: "Front & back uploaded",
    icon: Doc,
    state: "done",
  },
  {
    title: "Emergency Contact",
    subtitle: "Trusted contact on file",
    icon: Users,
    state: "done",
  },
  {
    title: "Background Check",
    subtitle: "In progress",
    icon: Shield,
    state: "pending",
  },
];

const completed = steps.filter((s) => s.state === "done").length;
const pct = Math.round((completed / steps.length) * 100);

export default function PassengerVerificationPage() {
  return (
    <div>
      <ScreenHeader title="Rider Verification" back="/profile" />
      <div className="px-4 pb-8">
        <p className="text-[13px] text-sub">
          Riders go through the same identity checks as partners — it&apos;s
          how FastGo keeps drivers safe from fraudulent bookings too.
        </p>

        <Card className="mt-3.5 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold">
              Verification Progress
            </span>
            <span className="text-[12.5px] font-semibold text-sub">
              {completed} of {steps.length} Completed
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[12px] font-bold text-brand">{pct}%</span>
          </div>
        </Card>

        <Card className="mt-3.5">
          {steps.map((s, i) => (
            <div key={s.title}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    s.state === "done"
                      ? "bg-brand-soft text-brand"
                      : "bg-warn-soft text-warn"
                  }`}
                >
                  <s.icon size={17} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-medium">{s.title}</span>
                  <span className="block text-[12.5px] text-sub">{s.subtitle}</span>
                </span>
                {s.state === "done" ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-good text-white">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                ) : (
                  <span
                    className="h-5 w-5 animate-spin rounded-full border-2 border-warn border-t-transparent"
                    aria-label="In progress"
                  />
                )}
              </div>
            </div>
          ))}
        </Card>

        <Card className="mt-3.5 flex items-center gap-3 border-brand/15 bg-brand-soft px-4 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <ShieldCheck size={20} />
          </span>
          <span>
            <span className="block text-[14px] font-bold">
              Almost verified!
            </span>
            <span className="block text-[12.5px] leading-snug text-sub">
              Background check usually completes within 24 hours.
            </span>
          </span>
        </Card>
      </div>
    </div>
  );
}
