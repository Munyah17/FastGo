import Link from "next/link";
import { Card, Divider } from "@/components/ui";
import { messages } from "@/lib/data";

export default function MessagesPage() {
  return (
    <div className="px-4">
      <header className="flex items-center justify-center py-4">
        <h1 className="text-[17px] font-semibold">Messages</h1>
      </header>

      <Card>
        {messages.map((m, i) => (
          <div key={m.from}>
            {i > 0 && <Divider />}
            <Link
              href="/messages/chat"
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-page/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[14px] font-bold text-brand">
                {m.from
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between">
                  <span
                    className={`text-[14px] ${
                      m.unread ? "font-bold" : "font-medium"
                    }`}
                  >
                    {m.from}
                  </span>
                  <span className="text-[11.5px] text-faint">{m.time}</span>
                </span>
                <span
                  className={`block truncate text-[13px] ${
                    m.unread ? "font-medium text-ink" : "text-sub"
                  }`}
                >
                  {m.preview}
                </span>
              </span>
              {m.unread && (
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
              )}
            </Link>
          </div>
        ))}
      </Card>
    </div>
  );
}
