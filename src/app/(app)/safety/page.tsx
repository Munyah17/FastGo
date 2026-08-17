import { ScreenHeader, Card, ListRow, Divider } from "@/components/ui";
import { Share, Users, ShieldCheck, Flag } from "@/components/Icons";
import SafetyToggles from "./SafetyToggles";

export default function SafetyPage() {
  return (
    <div>
      <ScreenHeader title="Safety Center" back="/" />

      <div className="px-4 pb-6">
        <Card className="flex items-center gap-4 border-bad/10 bg-bad-soft px-4 py-4">
          <span className="flex-1">
            <span className="block text-[15px] font-bold">
              In an emergency?
            </span>
            <span className="block text-[12.5px] leading-snug text-sub">
              Tap the button to alert your contacts and share your location.
            </span>
          </span>
          <button
            aria-label="SOS — send emergency alert"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-bad text-[15px] font-extrabold text-white shadow-lg shadow-bad/30 ring-4 ring-bad/20"
          >
            SOS
          </button>
        </Card>

        <Card className="mt-3.5">
          <ListRow
            href="/ride"
            icon={<Share size={17} />}
            title="Share My Trip"
            subtitle="Share trip details in real time"
          />
          <Divider />
          <ListRow
            href="/safety/contacts"
            icon={<Users size={17} />}
            title="Trusted Contacts"
            subtitle="Manage your emergency contacts"
          />
          <Divider />
          <ListRow
            href="/help/faqs"
            icon={<ShieldCheck size={17} />}
            title="Safety Toolkit"
            subtitle="Tips and in-app safety features"
          />
          <Divider />
          <ListRow
            href="/safety/report"
            icon={<Flag size={17} />}
            iconBg="bg-bad-soft text-bad"
            title="Report an Incident"
            subtitle="Report safety or security issues"
          />
        </Card>

        <SafetyToggles />
      </div>
    </div>
  );
}
