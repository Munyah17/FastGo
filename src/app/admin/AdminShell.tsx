"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendUp,
  Users,
  Car,
  ShieldCheck,
  Flag,
  MapPin,
  User,
  Bell,
  Search,
} from "@/components/Icons";
import { opsMetrics } from "@/lib/adminData";

const nav = [
  { href: "/admin", label: "Overview", icon: TrendUp },
  { href: "/admin/partners", label: "Partners", icon: Users },
  { href: "/admin/passengers", label: "Passengers", icon: User },
  { href: "/admin/trips", label: "Trips", icon: Car },
  { href: "/admin/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/admin/safety", label: "Safety", icon: Flag },
  { href: "/admin/councils", label: "Councils", icon: MapPin },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh bg-[#f3f4f7] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-line px-6">
          <span className="text-[19px] font-extrabold tracking-tight">
            Fast<span className="text-brand">Go</span>
          </span>
          <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[10.5px] font-bold text-brand">
            ADMIN
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  active
                    ? "bg-brand-soft text-brand"
                    : "text-sub hover:bg-page hover:text-ink"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 rounded-lg bg-page px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white">
              OA
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold">
                Ops Admin
              </span>
              <span className="block truncate text-[11.5px] text-sub">
                admin@fastgo.co.zw
              </span>
            </span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-[17px] font-extrabold tracking-tight">
              Fast<span className="text-brand">Go</span> Admin
            </span>
          </div>
          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg bg-page px-3 py-2 text-sub lg:flex">
            <Search size={16} />
            <input
              placeholder="Search partners, trips, passengers…"
              className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-faint"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            {opsMetrics.sosAlerts > 0 && (
              <Link
                href="/admin/safety"
                className="flex items-center gap-1.5 rounded-full bg-bad-soft px-3 py-1.5 text-[12.5px] font-semibold text-bad"
              >
                <Flag size={13} />
                {opsMetrics.sosAlerts} active SOS
              </Link>
            )}
            <button aria-label="Notifications" className="relative text-sub">
              <Bell size={19} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
