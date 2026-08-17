import Link from "next/link";
import { PageHeader, Panel, StatCard, StatusPill } from "./ui";
import { opsMetrics, revenueTrend, sosEvents, trips, fmtCompact } from "@/lib/adminData";

export default function AdminOverviewPage() {
  const maxGmv = Math.max(...revenueTrend.map((d) => d.gmv));

  return (
    <div>
      <PageHeader
        title="Operations Overview"
        subtitle="Live snapshot across all launch councils"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Online Partners" value={opsMetrics.onlinePartners.toLocaleString()} />
        <StatCard label="Active Trips" value={opsMetrics.activeTrips.toLocaleString()} />
        <StatCard label="Passengers Online" value={opsMetrics.passengersOnline.toLocaleString()} />
        <StatCard label="Trips Today" value={opsMetrics.tripsToday.toLocaleString()} />
        <StatCard label="GMV Today" value={fmtCompact(opsMetrics.gmvToday)} />
        <StatCard label="Platform Revenue" value={fmtCompact(opsMetrics.platformRevenueToday)} />
        <StatCard
          label="SOS Alerts"
          value={String(opsMetrics.sosAlerts)}
          tone={opsMetrics.sosAlerts > 0 ? "bad" : "good"}
          hint="Requires immediate attention"
        />
        <StatCard
          label="Documents Expiring"
          value={String(opsMetrics.documentsExpiring)}
          tone="warn"
          hint="Within 30 days"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">GMV & Platform Revenue: 7 days</h2>
          </div>
          <div className="mt-4 flex h-40 items-end gap-3">
            {revenueTrend.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-32 w-full items-end gap-1">
                  <div
                    className="flex-1 rounded-t-md bg-brand-soft"
                    style={{ height: `${(d.gmv / maxGmv) * 100}%` }}
                  />
                  <div
                    className="flex-1 rounded-t-md bg-brand"
                    style={{ height: `${(d.revenue / maxGmv) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-faint">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[12px] text-sub">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-brand-soft" /> GMV
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-brand" /> Platform revenue
            </span>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Safety Alerts</h2>
            <Link href="/admin/safety" className="text-[12.5px] font-semibold text-brand">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {sosEvents.map((s) => (
              <div key={s.id} className="rounded-lg border border-bad/20 bg-bad-soft/40 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">{s.trip}</span>
                  <StatusPill tone={s.status === "triggered" ? "bad" : "good"}>
                    {s.status}
                  </StatusPill>
                </div>
                <div className="mt-0.5 text-[12px] text-sub">{s.triggeredBy}</div>
                <div className="text-[11.5px] text-faint">{s.time}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-6">
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-[15px] font-semibold">Recent Trips</h2>
          <Link href="/admin/trips" className="text-[12.5px] font-semibold text-brand">
            View all
          </Link>
        </div>
        <div className="mt-3 divide-y divide-line">
          {trips.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-3 text-[13.5px]">
              <span className="w-24 shrink-0 font-semibold">{t.id}</span>
              <span className="flex-1 truncate text-sub">
                {t.passenger} → {t.partner}
              </span>
              <span className="w-32 shrink-0 truncate text-sub">{t.to}</span>
              <span className="w-16 shrink-0 text-right font-semibold">
                US${t.fare.toFixed(2)}
              </span>
              <span className="w-28 shrink-0 text-right">
                <StatusPill
                  tone={
                    t.status === "completed"
                      ? "good"
                      : t.status === "cancelled"
                        ? "bad"
                        : "brand"
                  }
                >
                  {t.status.replace("_", " ")}
                </StatusPill>
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
