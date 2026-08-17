import Link from "next/link";
import { Card, ListRow, Divider } from "@/components/ui";
import type { ComponentType } from "react";
import {
  Eye,
  Plus,
  Upload,
  Download,
  CreditCard,
  Dollar,
  Doc,
  Trophy,
  Wallet as WalletIcon,
} from "@/components/Icons";
import { user, todayEarnings, fmt } from "@/lib/data";

export default function WalletPage() {
  const max = Math.max(...todayEarnings.hours);
  return (
    <div>
      <div className="bg-brand px-4 pb-16 pt-5 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-[17px] font-semibold">Wallet</h1>
          <button aria-label="Toggle balance visibility">
            <Eye size={20} className="text-white/80" />
          </button>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="text-[12.5px] text-white/70">Wallet Balance</div>
            <div className="text-[30px] font-bold leading-tight">
              {fmt(user.walletBalance)}
            </div>
          </div>
          <Link
            href="/wallet/topup"
            className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-[13px] font-semibold text-brand"
          >
            <Plus size={15} /> Top Up
          </Link>
        </div>
      </div>

      <div className="-mt-9 px-4">
        <Card className="flex justify-around px-2 py-3.5 shadow-sm">
          {(
            [
              { label: "Top Up", icon: Upload, href: "/wallet/topup" },
              { label: "Transactions", icon: CreditCard, href: "/wallet/transactions" },
              { label: "Withdraw", icon: Download, href: "/wallet/withdraw" },
            ] as { label: string; icon: ComponentType<{ size?: number }>; href: string }[]
          ).map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-1.5 text-[12px] font-medium text-sub"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon size={18} />
              </span>
              {label}
            </Link>
          ))}
        </Card>

        <Card className="mt-3.5 px-4 py-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[13px] text-sub">Today&apos;s Earnings</div>
              <div className="mt-0.5 text-[24px] font-bold leading-tight">
                {fmt(todayEarnings.total)}
              </div>
              <div className="text-[12.5px] text-sub">
                {todayEarnings.trips} Trips
              </div>
            </div>
            <div className="flex h-16 items-end gap-1">
              {todayEarnings.hours.map((v, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-good-bright"
                  style={{ height: `${Math.max((v / max) * 100, 6)}%` }}
                />
              ))}
            </div>
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-faint">
            <span>00</span>
            <span>04</span>
            <span>08</span>
            <span>12</span>
            <span>16</span>
            <span>20</span>
            <span>24</span>
          </div>
        </Card>

        <Card className="mt-3.5">
          <ListRow
            href="/earnings"
            icon={<Dollar size={17} />}
            title="Earnings Breakdown"
          />
          <Divider />
          <ListRow
            href="/earnings/history"
            icon={<Doc size={17} />}
            title="Weekly Statement"
            subtitle="May 13 – May 19"
          />
          <Divider />
          <ListRow
            href="/incentives"
            icon={<Trophy size={17} />}
            iconBg="bg-warn-soft text-warn"
            title="Incentives"
            subtitle="You have 2 active"
          />
        </Card>

        <Link href="/earnings" className="mt-3.5 block pb-4">
          <Card className="flex items-center gap-3 border-brand/15 bg-brand-soft px-4 py-4">
            <span className="flex-1">
              <span className="block text-[14.5px] font-semibold">
                Keep your wallet funded
              </span>
              <span className="block text-[12.5px] text-sub">
                Maintain balance to stay on top of your rides.
              </span>
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
              <WalletIcon size={20} />
            </span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
