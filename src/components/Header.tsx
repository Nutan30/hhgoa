"use client";

import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-[#042e1a] border-b-[2px] border-[#FEE101]/30">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">

        {/* Logo badge */}
        <div className="relative shrink-0">
          <div className="inline-block px-3 py-1.5 border-2 border-[#FEE101] shadow-[3px_3px_0px_#000] sticker-tilt-l bg-[#075C35]">
            <span className="font-imbue text-[#FEE101] tracking-[0.08em] text-base md:text-lg leading-none font-bold">
              HH GOA &apos;26
            </span>
          </div>
        </div>

        {/* Center metadata */}
        <div className="hidden md:flex flex-col items-center gap-0.5">
          <span className="font-victor text-[#FEE101]/50 text-[9px] font-bold tracking-[0.3em] uppercase">
            GOA, INDIA · 28–31 OCT 2026
          </span>
        </div>

        {/* Hashtag stickers */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className="sticker-tilt-r inline-block bg-[#FEE101] border-2 border-[#000] px-2.5 py-1 text-[9px] font-bold text-[#075C35] shadow-[2px_2px_0px_#000] tracking-wide font-victor">
            #FrameInGoa
          </span>
          <span className="hidden sm:inline-block sticker-tilt-l bg-[#FF1684] border-2 border-[#000] px-2.5 py-1 text-[9px] font-bold text-white shadow-[2px_2px_0px_#000] tracking-wide font-victor">
            #HHGoa2026
          </span>
          <span className="hidden md:inline-block sticker-tilt-r bg-[#FFFBE8] border-2 border-[#000] px-2.5 py-1 text-[9px] font-bold text-[#075C35] shadow-[2px_2px_0px_#000] tracking-wide font-victor">
            #HackerHouse
          </span>
        </div>
      </div>
    </header>
  );
}
