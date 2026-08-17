import Link from "next/link";
import { ArrowLeft, ChevronRight } from "@/components/Icons";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white ${className}`}
    >
      {children}
    </div>
  );
}

export function ScreenHeader({
  title,
  back,
  right,
}: {
  title: string;
  back?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 bg-page/95 px-4 py-4 backdrop-blur">
      <div className="w-9">
        {back && (
          <Link
            href={back}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-white"
          >
            <ArrowLeft size={22} />
          </Link>
        )}
      </div>
      <h1 className="text-[17px] font-semibold">{title}</h1>
      <div className="flex w-9 justify-end">{right}</div>
    </header>
  );
}

export function ListRow({
  href = "#",
  icon,
  iconBg = "bg-brand-soft text-brand",
  title,
  subtitle,
  trailing,
  chevron = true,
}: {
  href?: string;
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  chevron?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-page/60"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-medium leading-tight">
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[12.5px] text-sub">
            {subtitle}
          </span>
        )}
      </span>
      {trailing}
      {chevron && <ChevronRight size={18} className="shrink-0 text-faint" />}
    </Link>
  );
}

export function Divider() {
  return <div className="mx-4 h-px bg-line" />;
}

export function Badge({
  tone = "good",
  children,
}: {
  tone?: "good" | "bad" | "warn" | "brand";
  children: React.ReactNode;
}) {
  const tones = {
    good: "bg-good-soft text-good",
    bad: "bg-bad-soft text-bad",
    warn: "bg-warn-soft text-warn",
    brand: "bg-brand-soft text-brand",
  } as const;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`block w-full rounded-xl bg-brand py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark ${className}`}
    >
      {children}
    </Link>
  );
}
