"use client";

import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-[#FFF7E6] border-b-[3px] border-[#0E3B2E]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo badge — green block with yellow text */}
        <div className="relative shrink-0">
          <div className="bg-[#145A3D] border-[3px] border-[#0E3B2E] px-4 py-2 shadow-[4px_4px_0px_#0E3B2E] sticker-tilt-l inline-block">
            <span
              className="text-[#FFD21A] tracking-[0.12em] text-xl md:text-2xl leading-none"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              HH GOA &apos;26
            </span>
          </div>
          {/* Pink pin */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FF2D85] border-2 border-[#0E3B2E] z-10" />
        </div>

        {/* Hashtag sticker badges */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className="sticker-tilt-r inline-block bg-[#FFD21A] border-2 border-[#0E3B2E] px-3 py-1 text-[11px] font-bold text-[#0E3B2E] shadow-[2px_2px_0px_#0E3B2E] tracking-wide font-mono">
            #FrameInGoa
          </span>
          <span className="hidden sm:inline-block sticker-tilt-l bg-[#FF2D85] border-2 border-[#0E3B2E] px-3 py-1 text-[11px] font-bold text-[#FFF7E6] shadow-[2px_2px_0px_#0E3B2E] tracking-wide font-mono">
            #HHGoa2026
          </span>
          <span className="hidden md:inline-block sticker-tilt-r bg-[#145A3D] border-2 border-[#0E3B2E] px-3 py-1 text-[11px] font-bold text-[#FFF7E6] shadow-[2px_2px_0px_#0E3B2E] tracking-wide font-mono">
            #HackerHouse
          </span>
        </div>
      </div>

      {/* Thick green accent stripe */}
      <div className="h-1.5 bg-[#145A3D]" />
    </header>
  );
}
