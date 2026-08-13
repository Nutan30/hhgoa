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

  return (
    <div className="w-full space-y-3">
      <label className="block">
        <span className="font-victor text-[#FEE101]/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 block">
          Name
        </span>
        <input
          id="builder-name"
          type="text"
          placeholder="Your Name"
          value={details.name}
          onChange={(e) => onChange({ ...details, name: e.target.value })}
          className="hh-input"
          maxLength={30}
        />
      </label>

      <label className="block">
        <span className="font-victor text-[#FEE101]/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 block">
          Stack / Role
        </span>
        <input
          id="builder-stack"
          type="text"
          placeholder="Full Stack Developer"
          value={details.stack}
          onChange={(e) => onChange({ ...details, stack: e.target.value })}
          className="hh-input"
          maxLength={40}
        />
      </label>

      <div>
        <span className="font-victor text-[#FEE101]/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 block">
          Builder Title
        </span>
        <div className="flex gap-2">
          <input
            id="builder-title"
            type="text"
            placeholder="Code Surfer"
            value={details.title}
            onChange={(e) => onChange({ ...details, title: e.target.value })}
            className="hh-input flex-1"
            maxLength={25}
          />
          <button
            id="generate-title-btn"
            onClick={handleGenerateTitle}
            className="hh-btn hh-btn-pink px-4 py-2 text-[10px] whitespace-nowrap"
          >
            <Sparkles size={13} />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
