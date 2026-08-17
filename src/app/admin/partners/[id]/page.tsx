import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/Icons";
import { Panel, StatusPill } from "../../ui";
import { partners, partnerDocuments, complianceEvents, type PartnerStatus } from "@/lib/adminData";

const statusTone: Record<PartnerStatus, "good" | "warn" | "bad" | "neutral"> = {
  active: "good",
  pending_review: "warn",
  suspended: "bad",
  deactivated: "neutral",
};

const docTone = { valid: "good", expiring_soon: "warn", expired: "bad" } as const;

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = partners.find((p) => p.id === id);
  if (!partner) notFound();

  const docs = partnerDocuments[id] ?? [];
  const events = complianceEvents[id] ?? [];

  return (
    <div>
      <Link
        href="/admin/partners"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-sub hover:text-ink"
      >
        <ArrowLeft size={15} /> Back to Partners
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-[17px] font-bold text-brand">
            {partner.name.split(" ").map((w) => w[0]).join("")}
          </span>
          <div>
            <h1 className="text-[20px] font-bold">{partner.name}</h1>
            <p className="text-[13px] text-sub">
              {partner.phone} • Partner since {partner.partnerSince}
            </p>
          </div>
          <StatusPill tone={statusTone[partner.status]}>
            {partner.status.replace("_", " ")}
          </StatusPill>
        </div>
        <div className="flex gap-2">
          {partner.status === "active" ? (
            <button className="rounded-lg border border-bad/30 bg-bad-soft px-4 py-2 text-[13px] font-semibold text-bad hover:bg-bad-soft/80">
              Suspend Partner
            </button>
          ) : partner.status === "suspended" ? (
            <button className="rounded-lg border border-good/30 bg-good-soft px-4 py-2 text-[13px] font-semibold text-good hover:bg-good-soft/80">
              Reinstate Partner
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="p-5">
          <div className="text-[12.5px] font-medium text-sub">Rating</div>
          <div className="mt-1 text-[22px] font-bold">{partner.rating.toFixed(2)}</div>
        </Panel>
        <Panel className="p-5">
          <div className="text-[12.5px] font-medium text-sub">Total Trips</div>
          <div className="mt-1 text-[22px] font-bold">{partner.totalTrips.toLocaleString()}</div>
        </Panel>
        <Panel className="p-5">
          <div className="text-[12.5px] font-medium text-sub">Acceptance Rate</div>
          <div className="mt-1 text-[22px] font-bold">{partner.acceptanceRate}%</div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <h2 className="text-[15px] font-semibold">Vehicle & Council</h2>
          <div className="mt-3 space-y-2.5 text-[13.5px]">
            <div className="flex justify-between">
              <span className="text-sub">Vehicle</span>
              <span className="font-semibold">{partner.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sub">Primary council</span>
              <span className="font-semibold">{partner.council}</span>
            </div>
          </div>

          <h2 className="mt-5 text-[15px] font-semibold">Documents</h2>
          <div className="mt-3 space-y-2">
            {docs.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg bg-page px-3 py-2.5">
                <div>
                  <div className="text-[13px] font-medium">{d.name}</div>
                  <div className="text-[11.5px] text-sub">Expires {d.expires}</div>
                </div>
                <StatusPill tone={docTone[d.status]}>{d.status.replace("_", " ")}</StatusPill>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <h2 className="text-[15px] font-semibold">Compliance Audit Trail</h2>
          <p className="mt-0.5 text-[12px] text-sub">
            Answers &quot;why was this partner allowed/paused to operate at time X&quot;.
          </p>
          <div className="mt-3 space-y-3">
            {events.length === 0 && (
              <p className="text-[13px] text-faint">No compliance events recorded.</p>
            )}
            {events.map((e, i) => (
              <div key={i} className="border-l-2 border-line pl-3">
                <div className="text-[13px] font-medium">{e.detail}</div>
                <div className="text-[11.5px] text-faint">
                  {e.type.replace(/_/g, " ")} • {e.time}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
