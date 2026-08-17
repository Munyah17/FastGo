import { ScreenHeader, Card, Divider } from "@/components/ui";
import { User, Plus, Phone } from "@/components/Icons";
import { trustedContacts } from "@/lib/data";

export default function TrustedContactsPage() {
  return (
    <div>
      <ScreenHeader title="Trusted Contacts" back="/safety" />
      <div className="px-4 pb-6">
        <p className="text-[13px] leading-relaxed text-sub">
          Trusted contacts receive your live trip link when you share a trip,
          and are alerted immediately if you press SOS.
        </p>

        <Card className="mt-3.5">
          {trustedContacts.map((c, i) => (
            <div key={c.name}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <User size={18} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-medium">
                    {c.name}
                    <span className="ml-2 rounded-full bg-page px-2 py-0.5 text-[11px] font-semibold text-sub">
                      {c.relation}
                    </span>
                  </span>
                  <span className="block text-[12.5px] text-sub">
                    {c.phone}
                  </span>
                </span>
                <button
                  aria-label={`Call ${c.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sub"
                >
                  <Phone size={15} />
                </button>
              </div>
            </div>
          ))}
        </Card>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white py-3.5 text-[14px] font-semibold text-sub">
          <Plus size={17} /> Add Trusted Contact
        </button>
      </div>
    </div>
  );
}
