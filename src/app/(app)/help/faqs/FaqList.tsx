"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { ChevronDown } from "@/components/Icons";
import { faqs } from "@/lib/data";

export default function FaqList() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="px-4 pb-6">
      <Card>
        {faqs.map((f, i) => (
          <div key={f.q} className={i > 0 ? "border-t border-line" : ""}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              aria-expanded={open === i}
            >
              <span className="flex-1 text-[14px] font-semibold">{f.q}</span>
              <ChevronDown
                size={17}
                className={`shrink-0 text-faint transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && (
              <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-sub">
                {f.a}
              </p>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
