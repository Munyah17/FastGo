"use client";

import { useState } from "react";
import { Panel } from "../ui";
import { councils } from "@/lib/adminData";

export default function CouncilRules() {
  const [state, setState] = useState(() =>
    Object.fromEntries(
      councils.map((c) => [
        c.slug,
        Object.fromEntries(c.rules.map((r) => [r.key, r.enabled])),
      ])
    )
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {councils.map((c) => (
        <Panel key={c.slug} className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">{c.name}</h2>
            <span className="text-[12px] text-sub">
              {c.activePartners.toLocaleString()} active partners
            </span>
          </div>
          <div className="mt-3 space-y-1">
            {c.rules.map((rule) => {
              const enabled = state[c.slug][rule.key];
              return (
                <div
                  key={rule.key}
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-page/60"
                >
                  <span className="text-[13px]">{rule.label}</span>
                  <button
                    role="switch"
                    aria-checked={enabled}
                    aria-label={rule.label}
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        [c.slug]: { ...s[c.slug], [rule.key]: !s[c.slug][rule.key] },
                      }))
                    }
                    className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
                      enabled ? "bg-good" : "bg-line"
                    }`}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        enabled ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Panel>
      ))}
    </div>
  );
}
