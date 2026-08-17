import Link from "next/link";
import MapMock from "@/components/MapMock";
import ModeToggle from "@/components/ModeToggle";
import FareOfferBar from "./FareOfferBar";
import {
  Menu,
  Bell,
  Search,
  Plus,
  Navigation,
  Question,
  ChevronRight,
  Car,
  Star,
  Briefcase,
} from "@/components/Icons";
import { savedPlaces } from "@/lib/data";

const categories = [
  { label: "Ride", icon: Car, active: true },
  { label: "Comfort", icon: Star, active: false },
  { label: "Intercity", icon: Navigation, active: false },
  { label: "Delivery", icon: Briefcase, active: false },
];

export default function PassengerHome() {
  return (
    <div>
      <div className="relative h-[54vh] min-h-[360px] overflow-hidden">
        <MapMock className="h-full" />

        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          <Link
            href="/profile"
            aria-label="Menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg"
          >
            <Menu size={20} />
          </Link>
          <ModeToggle />
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-bad" />
          </Link>
        </div>

        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full">
          <span className="relative block whitespace-nowrap rounded-full bg-brand px-4 py-2 text-[13.5px] font-semibold text-white shadow-lg">
            My Location
            <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-brand" />
          </span>
        </div>

        <button
          aria-label="Recenter map"
          className="absolute bottom-[76px] right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-lg"
        >
          <Navigation size={19} />
        </button>

        <Link
          href="/help/faqs"
          className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Question size={16} />
          </span>
          <span className="flex-1 text-[13px] font-medium leading-snug">
            How does FastGo work? Tap to learn.
          </span>
          <ChevronRight size={16} className="shrink-0 text-faint" />
        </Link>
      </div>

      <div className="relative rounded-t-3xl bg-page px-4 pb-4 pt-5 shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-4 gap-2">
          {categories.map(({ label, icon: Icon, active }) => (
            <Link
              key={label}
              href="/book"
              className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-center ${
                active
                  ? "bg-brand-soft ring-1 ring-brand/30"
                  : "bg-white ring-1 ring-line"
              }`}
            >
              <Icon size={20} className={active ? "text-brand" : "text-sub"} />
              <span
                className={`text-[11.5px] font-semibold ${
                  active ? "text-brand" : "text-sub"
                }`}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-3.5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-good" />
          <span className="flex-1 text-[14px] font-semibold">My Location</span>
          <span className="shrink-0 rounded-full bg-page px-2.5 py-1 text-[11px] font-semibold text-sub">
            Current
          </span>
        </div>

        <Link
          href="/book/search"
          className="mt-2.5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm"
        >
          <Search size={18} className="shrink-0 text-faint" />
          <span className="flex-1 text-[14.5px] text-faint">Where to?</span>
          <Plus size={18} className="shrink-0 text-faint" />
        </Link>

        <div className="mt-2.5 flex gap-2 overflow-x-auto">
          {savedPlaces.map((place) => (
            <Link
              key={place.label}
              href="/book"
              className="shrink-0 rounded-full bg-brand-soft px-3.5 py-1.5 text-[12.5px] font-semibold text-brand"
            >
              {place.label}
            </Link>
          ))}
        </div>

        <FareOfferBar />
      </div>
    </div>
  );
}
