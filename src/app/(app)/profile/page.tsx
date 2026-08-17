import Link from "next/link";
import { Card, ListRow, Divider, Badge } from "@/components/ui";
import {
  Gear,
  Star,
  ShieldCheck,
  Trophy,
  Doc,
  Shield,
  Question,
  Car,
  Users,
} from "@/components/Icons";
import { user, documents } from "@/lib/data";

export default function ProfilePage() {
  return (
    <div className="px-4">
      <header className="flex items-center justify-between py-4">
        <span className="w-9" />
        <h1 className="text-[17px] font-semibold">Profile</h1>
        <Link href="/settings" aria-label="Settings" className="text-sub">
          <Gear size={21} />
        </Link>
      </header>

      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-[20px] font-bold text-brand">
          TM
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold">{user.name}</span>
            <span className="flex items-center gap-1 text-[13px] font-semibold">
              <Star size={13} className="text-amber-400" /> {user.rating}
            </span>
          </div>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-good-soft px-2 py-0.5 text-[11.5px] font-semibold text-good">
            <ShieldCheck size={12} /> Verified Partner
          </span>
          <div className="mt-1 text-[12.5px] text-sub">
            FastGo Partner since {user.driverSince}
          </div>
        </div>
      </div>

      <Card className="mt-4 flex divide-x divide-line py-3.5 text-center">
        <div className="flex-1">
          <div className="text-[17px] font-bold">
            {user.trips.toLocaleString()}
          </div>
          <div className="text-[12px] text-sub">Trips</div>
        </div>
        <div className="flex-1">
          <div className="text-[17px] font-bold">{user.acceptance}%</div>
          <div className="text-[12px] text-sub">Acceptance</div>
        </div>
        <div className="flex-1">
          <div className="text-[17px] font-bold">{user.rating}</div>
          <div className="text-[12px] text-sub">Rating</div>
        </div>
      </Card>

      <Card className="mt-3.5 flex items-center gap-3 border-brand/15 bg-brand-soft px-4 py-3.5">
        <span className="flex-1">
          <span className="block text-[14.5px] font-semibold">
            You&apos;re doing great!
          </span>
          <span className="block text-[12.5px] text-sub">
            Keep it up to unlock more rewards.
          </span>
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warn-soft text-warn">
          <Trophy size={20} />
        </span>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">My Documents</h2>
        <Badge tone="good">All Valid</Badge>
      </div>

      <Card className="mt-2.5">
        {documents.map((doc, i) => (
          <div key={doc.name}>
            {i > 0 && <Divider />}
            <ListRow
              icon={<Doc size={17} />}
              title={doc.name}
              subtitle={`Expires ${doc.expires}`}
              trailing={<Badge tone="good">{doc.status}</Badge>}
              chevron={false}
            />
          </div>
        ))}
      </Card>

      <Card className="mt-3">
        <ListRow
          href="/documents"
          icon={<Doc size={17} />}
          title="View All Documents"
        />
        <Divider />
        <ListRow href="/trips" icon={<Doc size={17} />} title="My Trips" />
        <Divider />
        <ListRow href="/vehicle" icon={<Car size={17} />} title="My Vehicle" />
        <Divider />
        <ListRow
          href="/verification"
          icon={<ShieldCheck size={17} />}
          title="Verification Status"
        />
      </Card>

      <Card className="mt-3">
        <ListRow
          href="/safety"
          icon={<Shield size={17} />}
          iconBg="bg-bad-soft text-bad"
          title="Safety Center"
        />
        <Divider />
        <ListRow
          href="/protection"
          icon={<ShieldCheck size={17} />}
          title="Legal Aid Cover"
        />
        <Divider />
        <ListRow href="/refer" icon={<Users size={17} />} title="Refer & Earn" />
        <Divider />
        <ListRow
          href="/help"
          icon={<Question size={17} />}
          title="Help & Support"
        />
      </Card>

      <div className="mb-4" />
    </div>
  );
}
