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
    <div className="flex w-full border-2 border-[#0E3B2E] shadow-[3px_3px_0px_#0E3B2E] overflow-hidden">
      {(["formatA", "formatB"] as FormatType[]).map((fmt) => {
        const active = selected === fmt;
        return (
          <button
            key={fmt}
            id={`select-${fmt}`}
            onClick={() => onChange(fmt)}
            className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-3 font-bold text-sm tracking-widest uppercase transition-all duration-150 cursor-pointer border-r-2 last:border-r-0 border-[#0E3B2E] ${
              active
                ? "bg-[#145A3D] text-[#FFF7E6]"
                : "bg-[#FFF7E6] text-[#0E3B2E] hover:bg-[#FFD21A]/30"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {fmt === "formatA" ? <User size={15} /> : <CreditCard size={15} />}
            {fmt === "formatA" ? "PFP Frame" : "Builder ID"}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFD21A]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
