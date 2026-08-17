import { PageHeader, Panel, Table, Td, StatusPill } from "../ui";
import { trips, type TripStatus } from "@/lib/adminData";

const statusTone: Record<TripStatus, "good" | "bad" | "brand" | "warn"> = {
  matched: "brand",
  enroute_pickup: "brand",
  in_progress: "warn",
  completed: "good",
  cancelled: "bad",
};

export default function TripsPage() {
  return (
    <div>
      <PageHeader title="Trips" subtitle="Connections facilitated between passengers and partners" />

      <Panel>
        <Table columns={["Trip", "Passenger", "Partner", "Route", "Fare", "Status", "Time"]}>
          {trips.map((t) => (
            <tr key={t.id} className="hover:bg-page/60">
              <Td className="font-semibold">{t.id}</Td>
              <Td className="text-sub">{t.passenger}</Td>
              <Td className="text-sub">{t.partner}</Td>
              <Td className="text-sub">
                {t.from} → {t.to}
              </Td>
              <Td className="font-semibold">US${t.fare.toFixed(2)}</Td>
              <Td>
                <StatusPill tone={statusTone[t.status]}>{t.status.replace("_", " ")}</StatusPill>
              </Td>
              <Td className="text-sub">{t.time}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
