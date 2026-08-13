"use client";

import React, { useCallback } from "react";
import { Sparkles } from "lucide-react";
import type { BuilderDetails } from "@/lib/types";
import { BUILDER_TITLES } from "@/lib/types";

interface BuilderFormProps {
  details: BuilderDetails;
  onChange: (details: BuilderDetails) => void;
}

export default function BuilderForm({ details, onChange }: BuilderFormProps) {
  const handleGenerateTitle = useCallback(() => {
    const currentIdx = BUILDER_TITLES.indexOf(details.title as (typeof BUILDER_TITLES)[number]);
    let nextIdx: number;
    do {
      nextIdx = Math.floor(Math.random() * BUILDER_TITLES.length);
    } while (nextIdx === currentIdx && BUILDER_TITLES.length > 1);
    onChange({ ...details, title: BUILDER_TITLES[nextIdx] });
  }, [details, onChange]);

  const inputClass =
    "w-full px-4 py-3 border-2 border-[#0E3B2E] bg-[#FFF7E6] text-[#0E3B2E] placeholder-[#0E3B2E]/30 focus:outline-none focus:border-[#145A3D] focus:ring-2 focus:ring-[#FFD21A]/50 transition-all text-sm font-medium";

  return (
    <div className="w-full space-y-3">
      <label className="block">
        <span className="text-[#0E3B2E]/60 text-xs font-bold tracking-widest uppercase mb-1.5 block font-mono">
          Name
        </span>
        <input
          id="builder-name"
          type="text"
          placeholder="Your Name"
          value={details.name}
          onChange={(e) => onChange({ ...details, name: e.target.value })}
          className={inputClass}
          maxLength={30}
        />
      </label>

      <label className="block">
        <span className="text-[#0E3B2E]/60 text-xs font-bold tracking-widest uppercase mb-1.5 block font-mono">
          Stack / Role
        </span>
        <input
          id="builder-stack"
          type="text"
          placeholder="Full Stack Developer"
          value={details.stack}
          onChange={(e) => onChange({ ...details, stack: e.target.value })}
          className={inputClass}
          maxLength={40}
        />
      </label>

      <div>
        <span className="text-[#0E3B2E]/60 text-xs font-bold tracking-widest uppercase mb-1.5 block font-mono">
          Builder Title
        </span>
        <div className="flex gap-2">
          <input
            id="builder-title"
            type="text"
            placeholder="Code Surfer"
            value={details.title}
            onChange={(e) => onChange({ ...details, title: e.target.value })}
            className={`${inputClass} flex-1`}
            maxLength={25}
          />
          <button
            id="generate-title-btn"
            onClick={handleGenerateTitle}
            className="flex items-center gap-1.5 px-4 py-3 border-2 border-[#0E3B2E] bg-[#FF2D85] hover:bg-[#FF2D85]/80 text-[#FFF7E6] text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap shadow-[2px_2px_0px_#0E3B2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Sparkles size={14} />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
