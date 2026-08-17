import Link from "next/link";
import { ArrowLeft } from "@/components/Icons";

export default function OnboardingStepHeader({
  step,
  total,
  title,
  back,
}: {
  step: number;
  total: number;
  title: string;
  back: string;
}) {
  const pct = Math.round((step / total) * 100);
  return (
    <header className="sticky top-0 z-20 bg-page/95 px-4 pb-3 pt-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <Link
          href={back}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-white"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-[17px] font-semibold">{title}</h1>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[12px] font-medium text-sub">
          <span>
            Step {step} of {total}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </header>
  );
}
