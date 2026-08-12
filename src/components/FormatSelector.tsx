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
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 border-2 cursor-pointer ${
          selected === "formatA"
            ? "bg-[#FFE853] text-[#021a12] border-[#FFE853] shadow-[0_0_20px_rgba(255,232,83,0.3)]"
            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20"
        }`}
      >
        <User size={18} />
        PFP FRAME
      </button>
      <button
        id="select-format-b"
        onClick={() => onChange("formatB")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 border-2 cursor-pointer ${
          selected === "formatB"
            ? "bg-[#FFE853] text-[#021a12] border-[#FFE853] shadow-[0_0_20px_rgba(255,232,83,0.3)]"
            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20"
        }`}
      >
        <CreditCard size={18} />
        BUILDER ID
      </button>
    </div>
  );
}
