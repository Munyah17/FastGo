"use client";

import { useState } from "react";
import { Mic, Pin, EyeOff } from "@/components/Icons";
import { Card, Divider } from "@/components/ui";

const features = [
  {
    id: "audio",
    title: "Audio Record Ride",
    subtitle: "Record audio during your trip",
    icon: Mic,
    default: false,
  },
  {
    id: "pin",
    title: "PIN Verification",
    subtitle: "Verify PIN with your rider",
    icon: Pin,
    default: true,
  },
  {
    id: "hide",
    title: "Hide My Phone Number",
    subtitle: "Keep your number private",
    icon: EyeOff,
    default: true,
  },
];

export default function SafetyToggles() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(features.map((f) => [f.id, f.default]))
  );

  return (
    <>
      <h2 className="mb-2 mt-5 text-[15px] font-semibold">Safety Features</h2>
      <Card>
        {features.map(({ id, title, subtitle, icon: Icon }, i) => (
          <div key={id}>
            {i > 0 && <Divider />}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-page text-sub">
                <Icon size={17} />
              </span>
              <span className="flex-1">
                <span className="block text-[14.5px] font-medium">{title}</span>
                <span className="block text-[12.5px] text-sub">{subtitle}</span>
              </span>
              <button
                role="switch"
                aria-checked={state[id]}
                aria-label={title}
                onClick={() => setState((s) => ({ ...s, [id]: !s[id] }))}
                className={`h-7 w-12 rounded-full p-1 transition-colors ${
                  state[id] ? "bg-good" : "bg-line"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    state[id] ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
