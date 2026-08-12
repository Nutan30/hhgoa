"use client";

import React from "react";

export default function Header() {
  return (
    <header className="w-full py-5 px-4 text-center relative overflow-hidden border-b-2 border-[#0E3B2E] bg-[#FFF7E6]/90">
      {/* Subtle gradient glow behind header */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_48%,rgba(255,210,26,0.2)_49%,rgba(255,210,26,0.2)_51%,transparent_52%)] bg-[length:24px_24px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">🌴</span>
          <h1 className="poster-title text-5xl leading-none md:text-6xl text-[#145A3D]">
            HH GOA &apos;26
          </h1>
          <span className="text-2xl">🌴</span>
        </div>
        <p className="text-sm md:text-base font-black tracking-[0.32em] text-[#FF2D85] uppercase">
          Frame in Goa
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="-rotate-1 border border-[#0E3B2E] bg-[#FFD21A] px-2 py-1 text-[10px] font-black tracking-wider text-[#0E3B2E]">
            #FrameInGoa
          </span>
          <span className="rotate-1 border border-[#0E3B2E] bg-[#FF2D85] px-2 py-1 text-[10px] font-black tracking-wider text-white">#HHGoa2026</span>
          <span className="-rotate-1 border border-[#0E3B2E] bg-[#145A3D] px-2 py-1 text-[10px] font-black tracking-wider text-[#FFF7E6]">#HackerHouse</span>
        </div>
      </div>
    </header>
  );
}
