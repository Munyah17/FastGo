"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Car, Chat, User } from "@/components/Icons";

const leftTabs = [
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/trips", label: "Trips", icon: Car },
];

const rightTabs = [
  { href: "/messages", label: "Messages", icon: Chat },
  { href: "/profile", label: "Profile", icon: User },
];

const hiddenOn = [
  "/book",
  "/ride",
  "/onboarding",
  "/auth",
  "/searching",
  "/messages/chat",
  "/safety/report",
  "/drive/active",
];

export default function BottomNav() {
  const pathname = usePathname();
  if (hiddenOn.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return null;

  const homeActive = pathname === "/";

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 w-full border-t border-line bg-white/95 backdrop-blur">
      <div className="flex items-end justify-around pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {leftTabs.map((t) => (
          <TabLink key={t.href} {...t} active={pathname.startsWith(t.href)} />
        ))}

        <Link href="/" aria-label="Home" className="flex w-16 flex-col items-center gap-1 pb-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand shadow-sm">
            <Home size={19} className="text-white" />
          </span>
          <span
            className={`text-[10.5px] font-medium ${
              homeActive ? "text-brand" : "text-faint"
            }`}
          >
            Home
          </span>
        </Link>

        {rightTabs.map((t) => (
          <TabLink key={t.href} {...t} active={pathname.startsWith(t.href)} />
        ))}
      </div>
    </nav>
  );
}

function TabLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-16 flex-col items-center gap-1 pb-1 text-[10.5px] font-medium ${
        active ? "text-brand" : "text-faint hover:text-sub"
      }`}
    >
      <Icon size={22} />
      {label}
    </Link>
  );
}
