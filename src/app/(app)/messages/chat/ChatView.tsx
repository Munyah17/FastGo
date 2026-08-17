"use client";

import { useState } from "react";
import { chatThread } from "@/lib/data";

type Msg = { from: string; text: string; time: string };

export default function ChatView() {
  const [msgs, setMsgs] = useState<Msg[]>([...chatThread]);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs([
      ...msgs,
      {
        from: "me",
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="flex min-h-[calc(100dvh-72px)] flex-col">
      <div className="flex-1 space-y-2.5 px-4 py-4">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                m.from === "me"
                  ? "rounded-br-md bg-brand text-white"
                  : "rounded-bl-md border border-line bg-white"
              }`}
            >
              <p className="text-[14px] leading-snug">{m.text}</p>
              <p
                className={`mt-1 text-right text-[10.5px] ${
                  m.from === "me" ? "text-white/70" : "text-faint"
                }`}
              >
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 flex items-center gap-2 border-t border-line bg-white px-4 py-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          aria-label="Message"
          className="flex-1 rounded-full border border-line bg-page px-4 py-2.5 text-[14px] outline-none placeholder:text-faint focus:border-brand"
        />
        <button
          onClick={send}
          className="rounded-full bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
