import { ScreenHeader, Card, Divider } from "@/components/ui";
import { Doc, Download } from "@/components/Icons";
import { statements, fmt } from "@/lib/data";

export default function EarningsHistoryPage() {
  return (
    <div>
      <ScreenHeader title="Earnings History" back="/earnings" />
      <div className="px-4 pb-6">
        <Card>
          {statements.map((s, i) => (
            <div key={s.range}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Doc size={16} />
                </span>
                <span className="flex-1">
                  <span className="block text-[13.5px] font-medium">
                    {s.range}
                  </span>
                  <span className="block text-[12px] text-sub">
                    {s.trips} trips
                  </span>
                </span>
                <span className="text-[14px] font-bold">{fmt(s.amount)}</span>
                <button
                  aria-label={`Download statement ${s.range}`}
                  className="text-faint"
                >
                  <Download size={17} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
