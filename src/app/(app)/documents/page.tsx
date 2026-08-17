import { ScreenHeader, Card, Divider, Badge } from "@/components/ui";
import { Doc, Upload, ShieldCheck } from "@/components/Icons";
import { documents } from "@/lib/data";

export default function DocumentsPage() {
  return (
    <div>
      <ScreenHeader title="My Documents" back="/profile" />
      <div className="px-4 pb-6">
        <Card className="flex items-center gap-3 border-good/15 bg-good-soft px-4 py-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-good text-white">
            <ShieldCheck size={19} />
          </span>
          <span>
            <span className="block text-[14.5px] font-semibold">
              All documents valid
            </span>
            <span className="block text-[12.5px] text-sub">
              You&apos;re fully compliant and cleared to drive.
            </span>
          </span>
        </Card>

        <Card className="mt-3.5">
          {documents.map((doc, i) => (
            <div key={doc.name}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Doc size={16} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-medium">
                    {doc.name}
                  </span>
                  <span className="block text-[12.5px] text-sub">
                    Expires {doc.expires}
                  </span>
                </span>
                <Badge tone="good">{doc.status}</Badge>
              </div>
            </div>
          ))}
        </Card>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white py-3.5 text-[14px] font-semibold text-sub">
          <Upload size={17} /> Upload New Document
        </button>

        <p className="mt-3 text-center text-[12px] leading-relaxed text-faint">
          Expired documents automatically pause trip requests until renewed,
          keeping you compliant with national and council requirements.
        </p>
      </div>
    </div>
  );
}
