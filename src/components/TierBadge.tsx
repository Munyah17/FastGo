import type { Tier } from "@/lib/tier";
import { TIER_STYLES } from "@/lib/tier";

export default function TierBadge({ tier, className = "" }: { tier: Tier; className?: string }) {
  const style = TIER_STYLES[tier];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.bg} ${style.text} ${className}`}
    >
      {tier}
    </span>
  );
}
