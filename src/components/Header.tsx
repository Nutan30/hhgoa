"use client";

import React from "react";

export default function Header() {
  return (
    <header className="w-full py-5 px-4 text-center relative overflow-hidden">
      {/* Subtle gradient glow behind header */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a3d20]/80 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">🌴</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-wider text-[#FFE853] drop-shadow-[0_0_20px_rgba(255,232,83,0.4)]">
            HH GOA 2026
          </h1>
          <span className="text-2xl">🌴</span>
        </div>
        <p className="text-base md:text-lg font-bold tracking-[0.3em] text-white/90 uppercase">
          Frame in Goa
        </p>
        <div className="mt-2 inline-flex items-center gap-2 bg-[#FF3B81]/20 border border-[#FF3B81]/40 rounded-full px-4 py-1">
          <span className="text-xs font-semibold text-[#FF3B81] tracking-widest">
            #FrameInGoa
          </span>
        </div>
      </div>
    </header>
  );
}
