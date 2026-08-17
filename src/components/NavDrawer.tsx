"use client";

import Link from "next/link";
import { useMode } from "@/lib/ModeContext";
import Avatar from "@/components/Avatar";
import TierBadge from "@/components/TierBadge";
import { computeTier } from "@/lib/tier";
import { user } from "@/lib/data";
import {
  Car,
  Wallet,
  QrCode,
  Bell,
  Shield,
  Gear,
  Question,
  Users,
  ChevronRight,
  Star,
  X,
} from "@/components/Icons";

const menuItems = [
  { href: "/trips", label: "Trip History", icon: Car },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/wallet/scan-to-pay", label: "Scan to Pay", icon: QrCode },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/safety", label: "Safety Center", icon: Shield },
  { href: "/refer", label: "Refer & Earn", icon: Users },
  { href: "/settings", label: "Settings", icon: Gear },
  { href: "/help", label: "Help & Support", icon: Question },
];

export default function NavDrawer() {
  const { mode, setMode, drawerOpen, closeDrawer } = useMode();
  const otherMode = mode === "passenger" ? "driver" : "passenger";
  const tier = computeTier(user.trips, user.rating, user.memberSinceMonths);

  return (
    <>
      <div
        className={`absolute inset-0 z-40 bg-black/40 transition-opacity ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div
        className={`absolute inset-y-0 left-0 z-50 flex w-[80%] max-w-[300px] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="flex items-start justify-between px-4 pt-5">
          <Link href="/profile" onClick={closeDrawer} className="flex items-center gap-3">
            <Avatar name={user.name} avatarUrl={user.avatarUrl} size={52} className="text-[17px]" />
            <span>
              <span className="block text-[15.5px] font-bold">{user.name}</span>
              <span className="flex items-center gap-1 text-[12.5px] text-sub">
                <Star size={12} className="text-amber-400" /> {user.rating} ({user.trips})
              </span>
              <TierBadge tier={tier} className="mt-1" />
            </span>
          </Link>
          <button
            onClick={closeDrawer}
            aria-label="Close menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint hover:bg-page"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex-1">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeDrawer}
              className="flex items-center gap-3 px-4 py-3 hover:bg-page/70"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-page text-sub">
                <Icon size={16} />
              </span>
              <span className="flex-1 text-[14px] font-medium">{label}</span>
              <ChevronRight size={16} className="text-faint" />
            </Link>
          ))}
        </div>

        <div className="sticky bottom-0 border-t border-line bg-white px-4 py-4">
          <button
            onClick={() => {
              setMode(otherMode);
              closeDrawer();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[14.5px] font-bold text-white hover:bg-brand-dark"
          >
            Switch to {otherMode === "driver" ? "Driver" : "Passenger"} Mode
          </button>
        </div>
      </div>
    </>
  );
}
