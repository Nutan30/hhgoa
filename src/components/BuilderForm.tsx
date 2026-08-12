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
    "w-full px-4 py-3 rounded-sm bg-[#FFF7E6] border border-[#0E3B2E] text-[#0E3B2E] placeholder-[#145A3D]/45 focus:outline-none focus:border-[#FF2D85] focus:ring-1 focus:ring-[#FF2D85]/30 transition-all text-sm font-medium";
  const sectionLabelClass =
    "text-[#145A3D] text-xs font-black tracking-wider uppercase mb-1.5 block";

  return (
    <div className="poster-card w-full space-y-3 bg-[#FFF7E6] p-4">
      <label className="block">
        <span className={sectionLabelClass}>
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
        <span className={sectionLabelClass}>
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
        <span className={sectionLabelClass}>
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
            className="flex items-center gap-1.5 px-4 py-3 rounded-sm bg-[#FF2D85] border border-[#0E3B2E] hover:bg-[#FFD21A] hover:text-[#0E3B2E] text-white text-xs font-black transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles size={14} />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
