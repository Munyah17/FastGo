import Link from "next/link";
import { PageHeader, Panel, StatCard, Table, Td, StatusPill } from "../ui";
import { complianceSummary, partners, partnerDocuments } from "@/lib/adminData";

const expiringOrExpired = partners
  .flatMap((p) => (partnerDocuments[p.id] ?? []).map((d) => ({ partner: p, doc: d })))
  .filter(({ doc }) => doc.status !== "valid");

export default function CompliancePage() {
  return (
    <div>
      <PageHeader
        title="Fleet Compliance"
        subtitle="Compliance is enforced automatically: expired documents pause matching without manual intervention"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Active Vehicles" value={complianceSummary.activeVehicles.toLocaleString()} />
        <StatCard label="Compliant" value={complianceSummary.compliant.toLocaleString()} tone="good" />
        <StatCard label="Expiring < 30 days" value={complianceSummary.expiringSoon.toLocaleString()} tone="warn" />
        <StatCard label="Expired" value={complianceSummary.expired.toLocaleString()} tone="bad" />
        <StatCard label="Suspended" value={complianceSummary.suspended.toLocaleString()} tone="bad" />
      </div>

      <Panel className="mt-6">
        <div className="px-5 pt-4">
          <h2 className="text-[15px] font-semibold">Documents Needing Attention</h2>
        </div>
        <Table columns={["Partner", "Document", "Expires", "Status", ""]}>
          {expiringOrExpired.map(({ partner, doc }, i) => (
            <tr key={i} className="hover:bg-page/60">
              <Td className="font-semibold">{partner.name}</Td>
              <Td className="text-sub">{doc.name}</Td>
              <Td className="text-sub">{doc.expires}</Td>
              <Td>
                <StatusPill tone={doc.status === "expired" ? "bad" : "warn"}>
                  {doc.status.replace("_", " ")}
                </StatusPill>
              </Td>
              <Td>
                <Link href={`/admin/partners/${partner.id}`} className="font-semibold text-brand">
                  View partner
                </Link>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
