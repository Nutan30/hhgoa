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
    const currentIdx = BUILDER_TITLES.indexOf(
      details.title as (typeof BUILDER_TITLES)[number]
    );
    let nextIdx: number;
    do {
      nextIdx = Math.floor(Math.random() * BUILDER_TITLES.length);
    } while (nextIdx === currentIdx && BUILDER_TITLES.length > 1);
    onChange({ ...details, title: BUILDER_TITLES[nextIdx] });
  }, [details, onChange]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FFE853]/50 focus:ring-1 focus:ring-[#FFE853]/30 transition-all text-sm font-medium";

  return (
    <div className="w-full space-y-3">
      <label className="block">
        <span className="text-white/60 text-xs font-semibold tracking-wider uppercase mb-1.5 block">
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
        <span className="text-white/60 text-xs font-semibold tracking-wider uppercase mb-1.5 block">
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
        <span className="text-white/60 text-xs font-semibold tracking-wider uppercase mb-1.5 block">
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
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#FF3B81]/20 border border-[#FF3B81]/30 hover:bg-[#FF3B81]/30 text-[#FF3B81] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles size={14} />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
