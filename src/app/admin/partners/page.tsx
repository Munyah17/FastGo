import Link from "next/link";
import { PageHeader, Panel, Table, Td, StatusPill } from "../ui";
import { partners, type PartnerStatus } from "@/lib/adminData";

const statusTone: Record<PartnerStatus, "good" | "warn" | "bad" | "neutral"> = {
  active: "good",
  pending_review: "warn",
  suspended: "bad",
  deactivated: "neutral",
};

const complianceTone = {
  compliant: "good",
  expiring_soon: "warn",
  expired: "bad",
  under_review: "neutral",
} as const;

export default function PartnersPage() {
  return (
    <div>
      <PageHeader
        title="Partners"
        subtitle={`${partners.length.toLocaleString()} independent partners across all councils`}
      />

      <Panel>
        <Table columns={["Partner", "Council", "Vehicle", "Compliance", "Rating", "Trips", "Status", ""]}>
          {partners.map((p) => (
            <tr key={p.id} className="hover:bg-page/60">
              <Td>
                <div className="font-semibold">{p.name}</div>
                <div className="text-[12px] text-sub">{p.phone}</div>
              </Td>
              <Td className="text-sub">{p.council}</Td>
              <Td className="text-sub">{p.vehicle}</Td>
              <Td>
                <StatusPill tone={complianceTone[p.complianceStatus]}>
                  {p.complianceStatus.replace("_", " ")}
                </StatusPill>
              </Td>
              <Td className="font-semibold">{p.rating.toFixed(1)}</Td>
              <Td className="text-sub">{p.totalTrips.toLocaleString()}</Td>
              <Td>
                <StatusPill tone={statusTone[p.status]}>
                  {p.status.replace("_", " ")}
                </StatusPill>
              </Td>
              <Td>
                <Link href={`/admin/partners/${p.id}`} className="font-semibold text-brand">
                  View
                </Link>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
