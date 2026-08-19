import Link from "next/link";
import { ScreenHeader, Card, ListRow, Divider } from "@/components/ui";
import Avatar from "@/components/Avatar";
import {
  User,
  Car,
  CreditCard,
  Bell,
  Lock,
  Question,
  Doc,
  ShieldCheck,
  Wallet,
  Flag,
} from "@/components/Icons";
import { user, driverToday, fmt } from "@/lib/data";

export default function SettingsPage() {
  return (
    <div>
      <ScreenHeader title="Settings" back="/profile" />
      <div className="px-4 pb-6">
        <Card className="flex items-center gap-3 px-4 py-3.5">
          <Avatar name={user.name} avatarUrl={user.avatarUrl} size={48} className="text-[15px]" />
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

        <div className="mb-2 mt-3.5 text-[13px] font-semibold text-sub">
          Today&apos;s Activity
        </div>
        <Card className="flex divide-x divide-line py-3.5 text-center">
          <div className="flex-1">
            <div className="text-[15.5px] font-bold">{fmt(driverToday.earningsToday)}</div>
            <div className="text-[11.5px] text-sub">Today</div>
          </div>
          <div className="flex-1">
            <div className="text-[15.5px] font-bold">{driverToday.tripsToday}</div>
            <div className="text-[11.5px] text-sub">Trips</div>
          </div>
          <div className="flex-1">
            <div className="text-[15.5px] font-bold">{driverToday.hoursOnline}</div>
            <div className="text-[11.5px] text-sub">Online</div>
          </div>
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
          <Divider />
          <ListRow
            href="/settings/payments"
            icon={<Wallet size={17} />}
            title="Payments You Accept"
            subtitle="As a driver: all methods or wallet only"
          />
        </Card>

        {driverToday.cancellationsThisWeek > 0 && (
          <Link
            href="/help"
            className="mt-3.5 flex items-center gap-3 rounded-2xl border border-warn/25 bg-warn-soft px-4 py-3"
          >
            <Flag size={16} className="shrink-0 text-warn" />
            <span className="flex-1 text-[12.5px] leading-snug text-ink">
              <span className="font-semibold">
                {driverToday.cancellationsThisWeek} of {driverToday.cancellationLimit}
              </span>{" "}
              cancellation strikes this week. Only cancellations our fraud
              checks flag as suspicious count.{" "}
              {driverToday.cancellationLimit - driverToday.cancellationsThisWeek} more
              pauses your account. Contact support if this looks wrong.
            </span>
          </Link>
        )}

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
