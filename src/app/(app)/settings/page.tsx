import { ScreenHeader, Card, ListRow, Divider } from "@/components/ui";
import {
  User,
  Car,
  CreditCard,
  Bell,
  Lock,
  Question,
  Doc,
  ShieldCheck,
} from "@/components/Icons";
import { user } from "@/lib/data";

export default function SettingsPage() {
  return (
    <div>
      <ScreenHeader title="Settings" back="/profile" />
      <div className="px-4 pb-6">
        <Card className="flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-[15px] font-bold text-brand">
            TM
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">{user.name}</span>
            <span className="block text-[12.5px] text-sub">
              +263 77 123 4567
            </span>
          </span>
          <button className="rounded-lg bg-brand-soft px-3 py-1.5 text-[12.5px] font-semibold text-brand">
            Edit
          </button>
        </Card>

        <Card className="mt-3.5">
          <ListRow
            href="/documents"
            icon={<Doc size={17} />}
            title="My Documents"
          />
          <Divider />
          <ListRow
            href="/vehicle"
            icon={<Car size={17} />}
            title="My Vehicle"
            subtitle="Toyota Allion • AFD 1234"
          />
          <Divider />
          <ListRow
            href="/verification"
            icon={<ShieldCheck size={17} />}
            title="Driver Verification"
            subtitle="4 of 5 completed"
          />
          <Divider />
          <ListRow
            href="/verification/passenger"
            icon={<ShieldCheck size={17} />}
            title="Rider Verification"
            subtitle="3 of 4 completed"
          />
        </Card>

        <Card className="mt-3.5">
          <ListRow
            icon={<User size={17} />}
            title="Account Settings"
            subtitle="Personal information"
          />
          <Divider />
          <ListRow
            href="/notifications"
            icon={<Bell size={17} />}
            title="Notification Settings"
            subtitle="Manage your alerts"
          />
          <Divider />
          <ListRow
            icon={<Lock size={17} />}
            title="Privacy & Security"
            subtitle="Control your data"
          />
          <Divider />
          <ListRow
            href="/wallet"
            icon={<CreditCard size={17} />}
            title="Payment Methods"
            subtitle="Manage payment options"
          />
          <Divider />
          <ListRow
            icon={<span className="text-[13px] font-bold">A</span>}
            title="Language"
            subtitle="English"
          />
          <Divider />
          <ListRow
            href="/help"
            icon={<Question size={17} />}
            title="Help & Support"
            subtitle="Get help when you need it"
          />
        </Card>

        <button className="mt-5 flex w-full items-center justify-center gap-1.5 py-2 text-[14.5px] font-semibold text-bad">
          Log Out
        </button>

        <p className="mt-3 text-center text-[11.5px] text-faint">
          FastGo v0.1.0 • 100% Zimbabwe Built
        </p>
      </div>
    </div>
  );
}
