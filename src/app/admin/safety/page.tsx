import { PageHeader, Panel, Table, Td, StatusPill } from "../ui";
import { sosEvents, incidentReports } from "@/lib/adminData";

export default function SafetyPage() {
  return (
    <div>
      <PageHeader title="Safety & Incidents" subtitle="SOS alerts and incident reports across the platform" />

      <Panel>
        <div className="px-5 pt-4">
          <h2 className="text-[15px] font-semibold">SOS Alerts</h2>
        </div>
        <Table columns={["Trip", "Triggered By", "Status", "Time"]}>
          {sosEvents.map((s) => (
            <tr key={s.id} className="hover:bg-page/60">
              <Td className="font-semibold">{s.trip}</Td>
              <Td className="text-sub">{s.triggeredBy}</Td>
              <Td>
                <StatusPill tone={s.status === "triggered" ? "bad" : "good"}>
                  {s.status}
                </StatusPill>
              </Td>
              <Td className="text-sub">{s.time}</Td>
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel className="mt-6">
        <div className="px-5 pt-4">
          <h2 className="text-[15px] font-semibold">Incident Reports</h2>
        </div>
        <Table columns={["Reference", "Category", "Reporter", "Status", "Time"]}>
          {incidentReports.map((r) => (
            <tr key={r.id} className="hover:bg-page/60">
              <Td className="font-semibold">{r.id}</Td>
              <Td className="text-sub">{r.category}</Td>
              <Td className="text-sub">{r.reporter}</Td>
              <Td>
                <StatusPill
                  tone={
                    r.status === "resolved"
                      ? "good"
                      : r.status === "under_review"
                        ? "warn"
                        : "brand"
                  }
                >
                  {r.status.replace("_", " ")}
                </StatusPill>
              </Td>
              <Td className="text-sub">{r.time}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
