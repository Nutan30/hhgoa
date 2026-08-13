"use client";

import React from "react";
import type { FormatType } from "@/lib/types";
import { User, CreditCard } from "lucide-react";

interface FormatSelectorProps {
  selected: FormatType;
  onChange: (format: FormatType) => void;
}

export default function FormatSelector({ selected, onChange }: FormatSelectorProps) {
  return (
    <div className="flex w-full border-2 border-[#FEE101] shadow-[4px_4px_0px_#000] overflow-hidden">
      {(["formatA", "formatB"] as FormatType[]).map((fmt) => {
        const active = selected === fmt;
        return (
          <button
            key={fmt}
            id={`select-${fmt}`}
            onClick={() => onChange(fmt)}
            className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-3 font-victor font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-150 cursor-pointer border-r-2 last:border-r-0 border-[#FEE101]/40 ${
              active
                ? "bg-[#FEE101] text-[#075C35]"
                : "bg-[#042e1a] text-[#FEE101]/70 hover:bg-[#0B6839]/60 hover:text-[#FEE101]"
            }`}
          >
            {fmt === "formatA" ? <User size={14} /> : <CreditCard size={14} />}
            {fmt === "formatA" ? "PFP Frame" : "Builder ID"}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF1684]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
