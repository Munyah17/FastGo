"use client";

import { useState } from "react";
import Link from "next/link";
import { Share, CheckCircle, Users } from "@/components/Icons";
import { trustedContacts } from "@/lib/data";

export default function ShareTripButton({
  driverName,
  pickup,
  dropoff,
}: {
  driverName: string;
  pickup: string;
  dropoff: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState(false);

  const toggle = (name: string) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const selectAll = () => setSelected(new Set(trustedContacts.map((c) => c.name)));

  const send = () => {
    setSent(true);
    setTimeout(() => {
      setOpen(false);
      setSent(false);
      setSelected(new Set());
    }, 1600);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-sub"
      >
        <Share size={13} /> Share trip
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-[420px] rounded-t-3xl bg-white px-4 pb-6 pt-4">
            {sent ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-good-soft text-good">
                  <CheckCircle size={28} />
                </span>
                <p className="text-[14.5px] font-semibold">Trip details sent</p>
                <p className="text-[12.5px] text-sub">
                  {selected.size} contact{selected.size !== 1 ? "s" : ""} can now track
                  this trip live.
                </p>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
                <h2 className="text-[16px] font-bold">Share Trip</h2>
                <p className="mt-0.5 text-[12.5px] text-sub">
                  With {driverName} • {pickup} → {dropoff}
                </p>

                {trustedContacts.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-sub">
                    No trusted contacts yet.{" "}
                    <Link href="/safety/contacts" className="font-semibold text-brand">
                      Add one
                    </Link>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={selectAll}
                      className="mt-4 flex w-full items-center gap-2 rounded-xl bg-brand-soft px-3.5 py-2.5 text-[13px] font-semibold text-brand"
                    >
                      <Users size={15} /> Share with all trusted contacts
                    </button>
                    <div className="mt-2 divide-y divide-line rounded-xl border border-line">
                      {trustedContacts.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => toggle(c.name)}
                          className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-page text-[12px] font-bold text-sub">
                            {c.name.split(" ").map((w) => w[0]).join("")}
                          </span>
                          <span className="flex-1">
                            <span className="block text-[13.5px] font-medium">
                              {c.name}{" "}
                              <span className="text-[11px] font-normal text-faint">
                                {c.relation}
                              </span>
                            </span>
                            <span className="block text-[11.5px] text-sub">{c.phone}</span>
                          </span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              selected.has(c.name) ? "border-brand bg-brand" : "border-line"
                            }`}
                          >
                            {selected.has(c.name) && (
                              <CheckCircle size={13} className="text-white" />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={selected.size === 0}
                      onClick={send}
                      className="mt-4 w-full rounded-xl bg-brand py-3 text-[14px] font-semibold text-white disabled:opacity-40"
                    >
                      Send to {selected.size || ""} Selected
                    </button>
                  </>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="mt-2 w-full py-2 text-[13px] font-semibold text-sub"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
