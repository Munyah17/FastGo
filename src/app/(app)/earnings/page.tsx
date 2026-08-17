import { Calendar } from "@/components/Icons";
import EarningsView from "./EarningsView";

export default function EarningsPage() {
  return (
    <div>
      <header className="sticky top-0 z-20 flex items-center justify-between bg-page/95 px-4 py-4 backdrop-blur">
        <span className="w-9" />
        <h1 className="text-[17px] font-semibold">Earnings</h1>
        <button aria-label="Pick date range" className="flex w-9 justify-end text-sub">
          <Calendar size={20} />
        </button>
      </header>
      <EarningsView />
    </div>
  );
}
