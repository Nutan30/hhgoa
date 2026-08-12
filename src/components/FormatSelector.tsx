"use client";

import React from "react";
import type { FormatType } from "@/lib/types";
import { User, CreditCard } from "lucide-react";

interface FormatSelectorProps {
  selected: FormatType;
  onChange: (format: FormatType) => void;
}

export default function FormatSelector({
  selected,
  onChange,
}: FormatSelectorProps) {
  return (
    <div className="flex gap-3 w-full max-w-md mx-auto">
      <button
        id="select-format-a"
        onClick={() => onChange("formatA")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-sm font-black text-sm tracking-wide transition-all duration-300 border-2 border-[#0E3B2E] cursor-pointer ${
          selected === "formatA"
            ? "bg-[#FF2D85] text-white shadow-[4px_4px_0_#0E3B2E] -translate-y-0.5"
            : "bg-[#FFF7E6] text-[#145A3D] hover:bg-[#FFD21A]"
        }`}
      >
        <User size={18} />
        PFP FRAME
      </button>
      <button
        id="select-format-b"
        onClick={() => onChange("formatB")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-sm font-black text-sm tracking-wide transition-all duration-300 border-2 border-[#0E3B2E] cursor-pointer ${
          selected === "formatB"
            ? "bg-[#FF2D85] text-white shadow-[4px_4px_0_#0E3B2E] -translate-y-0.5"
            : "bg-[#FFF7E6] text-[#145A3D] hover:bg-[#FFD21A]"
        }`}
      >
        <CreditCard size={18} />
        BUILDER ID
      </button>
    </div>
  );
}
