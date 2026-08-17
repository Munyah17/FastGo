// Mirrors compute_profile_tier() in supabase/migrations/0018_profile_tiers.sql
// — keep the thresholds in sync if either side changes. Deliberately a
// blend of quantity (completed trips), quality (rating) AND length (tenure
// months) — a high trip count with a mediocre rating, or a great rating
// with almost no history, both cap out below the top tiers.

export type Tier = "Starter" | "Bronze" | "Silver" | "Gold" | "Diamond" | "Platinum";

export const TIER_ORDER: Tier[] = ["Starter", "Bronze", "Silver", "Gold", "Diamond", "Platinum"];

export function computeTier(trips: number, rating: number, tenureMonths: number): Tier {
  const qualifies = (minTrips: number, minRating: number, minTenure: number) =>
    trips >= minTrips && rating >= minRating && tenureMonths >= minTenure;

  if (qualifies(1500, 4.8, 24)) return "Platinum";
  if (qualifies(700, 4.7, 12)) return "Diamond";
  if (qualifies(300, 4.5, 6)) return "Gold";
  if (qualifies(100, 4.3, 3)) return "Silver";
  if (qualifies(20, 4.0, 0)) return "Bronze";
  return "Starter";
}

export const TIER_STYLES: Record<Tier, { bg: string; text: string }> = {
  Starter: { bg: "bg-page", text: "text-sub" },
  Bronze: { bg: "bg-amber-100", text: "text-amber-800" },
  Silver: { bg: "bg-slate-200", text: "text-slate-700" },
  Gold: { bg: "bg-yellow-100", text: "text-yellow-800" },
  Diamond: { bg: "bg-cyan-100", text: "text-cyan-800" },
  Platinum: { bg: "bg-violet-100", text: "text-violet-800" },
};

export function nextTierRequirement(trips: number, rating: number, tenureMonths: number): string | null {
  const current = computeTier(trips, rating, tenureMonths);
  const idx = TIER_ORDER.indexOf(current);
  if (idx === TIER_ORDER.length - 1) return null;

  const thresholds = [
    null,
    { trips: 20, rating: 4.0, tenure: 0 },
    { trips: 100, rating: 4.3, tenure: 3 },
    { trips: 300, rating: 4.5, tenure: 6 },
    { trips: 700, rating: 4.7, tenure: 12 },
    { trips: 1500, rating: 4.8, tenure: 24 },
  ] as const;

  const next = thresholds[idx + 1];
  if (!next) return null;

  const gaps: string[] = [];
  if (trips < next.trips) gaps.push(`${next.trips - trips} more trips`);
  if (rating < next.rating) gaps.push(`${next.rating.toFixed(1)}+ rating`);
  if (tenureMonths < next.tenure) gaps.push(`${next.tenure - tenureMonths} more months`);
  return gaps.length ? `Need ${gaps.join(", ")} for ${TIER_ORDER[idx + 1]}` : null;
}
