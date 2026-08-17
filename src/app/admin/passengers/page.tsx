import { PageHeader, Panel, Table, Td, StatusPill } from "../ui";
import { passengers } from "@/lib/adminData";

export default function PassengersPage() {
  return (
    <div>
      <PageHeader
        title="Passengers"
        subtitle={`${passengers.length.toLocaleString()} registered passengers`}
      />

      <Panel>
        <Table columns={["Passenger", "Phone", "Rating", "Trips", "Joined", "Status"]}>
          {passengers.map((u) => (
            <tr key={u.id} className="hover:bg-page/60">
              <Td className="font-semibold">{u.name}</Td>
              <Td className="text-sub">{u.phone}</Td>
              <Td className="font-semibold">{u.rating.toFixed(1)}</Td>
              <Td className="text-sub">{u.totalTrips.toLocaleString()}</Td>
              <Td className="text-sub">{u.joined}</Td>
              <Td>
                <StatusPill tone={u.status === "flagged" ? "warn" : "good"}>
                  {u.status}
                </StatusPill>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
