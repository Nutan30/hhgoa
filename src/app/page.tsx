"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { FormatType, TransformState, BuilderDetails } from "@/lib/types";
import { processUploadedFile, loadImage } from "@/lib/imageUtils";
import { preloadOverlays } from "@/lib/canvas";

import Header from "@/components/Header";
import FormatSelector from "@/components/FormatSelector";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoEditor from "@/components/PhotoEditor";
import BuilderForm from "@/components/BuilderForm";
import PreviewCanvas from "@/components/PreviewCanvas";
import ExportActions from "@/components/ExportActions";

export default function Home() {
  const [format, setFormat] = useState<FormatType>("formatA");
  const [userPhoto, setUserPhoto] = useState<HTMLImageElement | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [transform, setTransform] = useState<TransformState>({ scale: 1, offsetX: 0, offsetY: 0 });
  const [builderDetails, setBuilderDetails] = useState<BuilderDetails>({ name: "", stack: "", title: "" });
  const [overlaysReady, setOverlaysReady] = useState(false);

  useEffect(() => {
    preloadOverlays()
      .then(() => setOverlaysReady(true))
      .catch((err) => console.error("Failed to preload overlays:", String(err).replace(/[\r\n]/g, " ")));
  }, []);

  const handleFileSelected = useCallback(
    async (file: File) => {
      try {
        if (photoUrl) URL.revokeObjectURL(photoUrl);
        const url = await processUploadedFile(file);
        setPhotoUrl(url);
        const img = await loadImage(url);
        setUserPhoto(img);
        setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
      } catch (err) {
        console.error("Failed to process photo:", String(err).replace(/[\r\n]/g, " "));
      }
    },
    [photoUrl]
  );

  const handleFormatChange = useCallback((f: FormatType) => {
    setFormat(f);
    setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
  }, []);

  if (!overlaysReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-doodle">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#145A3D] border-t-[#FFD21A] rounded-full animate-spin" />
          <p className="text-[#0E3B2E]/50 text-xs font-bold tracking-[0.2em] uppercase font-mono">
            Loading HH Goa assets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-doodle text-[#0E3B2E] flex flex-col">

      {/* ── Tropical SVG decorations (desktop only, behind everything) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden lg:block" aria-hidden="true">
        {/* Palm left */}
        <svg className="absolute -left-10 top-28 w-44 opacity-[0.05]" viewBox="0 0 120 220" fill="none">
          <path d="M62 220 Q60 150 57 105" stroke="#145A3D" strokeWidth="5" strokeLinecap="round"/>
          <path d="M57 105 Q18 72 2 38 Q32 56 57 105" fill="#145A3D"/>
          <path d="M57 105 Q8 92 -2 64 Q26 76 57 105" fill="#145A3D"/>
          <path d="M57 105 Q38 58 50 26 Q57 62 57 105" fill="#145A3D"/>
          <path d="M57 105 Q84 62 106 46 Q82 72 57 105" fill="#145A3D"/>
          <path d="M57 105 Q96 82 114 60 Q88 82 57 105" fill="#145A3D"/>
        </svg>
        {/* Palm right */}
        <svg className="absolute -right-10 top-36 w-40 opacity-[0.05] scale-x-[-1]" viewBox="0 0 120 220" fill="none">
          <path d="M62 220 Q60 150 57 105" stroke="#145A3D" strokeWidth="5" strokeLinecap="round"/>
          <path d="M57 105 Q18 72 2 38 Q32 56 57 105" fill="#145A3D"/>
          <path d="M57 105 Q8 92 -2 64 Q26 76 57 105" fill="#145A3D"/>
          <path d="M57 105 Q38 58 50 26 Q57 62 57 105" fill="#145A3D"/>
          <path d="M57 105 Q84 62 106 46 Q82 72 57 105" fill="#145A3D"/>
        </svg>
        {/* Sun rays */}
        <svg className="absolute right-24 top-10 w-20 opacity-[0.06]" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="13" fill="#FFD21A" stroke="#0E3B2E" strokeWidth="2"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
            <line key={i}
              x1={40 + 17 * Math.cos((deg * Math.PI) / 180)}
              y1={40 + 17 * Math.sin((deg * Math.PI) / 180)}
              x2={40 + 27 * Math.cos((deg * Math.PI) / 180)}
              y2={40 + 27 * Math.sin((deg * Math.PI) / 180)}
              stroke="#0E3B2E" strokeWidth="2" strokeLinecap="round"
            />
          ))}
        </svg>
        {/* Waves bottom-left */}
        <svg className="absolute left-0 bottom-16 w-64 opacity-[0.05]" viewBox="0 0 240 50" fill="none">
          <path d="M0 25 Q30 8 60 25 Q90 42 120 25 Q150 8 180 25 Q210 42 240 25" stroke="#145A3D" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M0 36 Q30 19 60 36 Q90 53 120 36 Q150 19 180 36 Q210 53 240 36" stroke="#145A3D" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {/* Surfboard bottom-right */}
        <svg className="absolute right-14 bottom-20 w-14 opacity-[0.05] rotate-[-28deg]" viewBox="0 0 40 120" fill="none">
          <ellipse cx="20" cy="55" rx="11" ry="48" fill="#FF2D85" stroke="#0E3B2E" strokeWidth="2"/>
          <ellipse cx="20" cy="88" rx="5" ry="7" fill="#FFD21A" stroke="#0E3B2E" strokeWidth="1.5"/>
        </svg>
        {/* Small leaf accent */}
        <svg className="absolute left-36 top-6 w-10 opacity-[0.05] rotate-[18deg]" viewBox="0 0 50 80" fill="none">
          <path d="M25 75 Q5 50 10 20 Q25 0 40 20 Q45 50 25 75Z" fill="#145A3D" stroke="#0E3B2E" strokeWidth="1.5"/>
          <path d="M25 75 Q25 40 25 10" stroke="#FFF7E6" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </div>

      <Header />

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden border-b-[3px] border-[#0E3B2E] bg-[#FFF7E6]">
        {/* Giant background text — festival poster style */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="text-[#0E3B2E] opacity-[0.04] whitespace-nowrap leading-none"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(5rem, 18vw, 14rem)",
              letterSpacing: "-0.02em",
            }}
          >
            HACKER HOUSE
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Left: headline */}
            <div>
              {/* Small eyebrow label */}
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-[3px] bg-[#FF2D85] inline-block" />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#0E3B2E]/60 font-mono">
                  HH Goa 2026 · Frame Generator
                </span>
              </div>

              <h1 className="leading-none mb-0.5">
                <span
                  className="block text-[#145A3D]"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(2.8rem, 9vw, 5.5rem)",
                    letterSpacing: "0.01em",
                  }}
                >
                  FRAME YOUR
                </span>
                <span
                  className="block text-[#FF2D85] relative"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(2.8rem, 9vw, 5.5rem)",
                    letterSpacing: "0.01em",
                  }}
                >
                  BUILDER
                  {/* Yellow underline squiggle */}
                  <svg
                    className="absolute -bottom-1 left-0 w-full max-w-[320px] h-3 hidden sm:block"
                    viewBox="0 0 320 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8 Q40 2 80 8 Q120 14 160 8 Q200 2 240 8 Q280 14 318 8"
                      stroke="#FFD21A"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Right: subtitle + vibe line */}
            <div className="sm:text-right max-w-xs sm:max-w-[220px] shrink-0">
              <p className="text-sm text-[#0E3B2E]/65 font-mono leading-relaxed">
                Upload a photo. Pick a format. Get a tropical hacker house identity.
              </p>
              <p className="text-sm text-[#FF2D85] font-bold mt-1.5 font-mono">
                No login. No tracking. Just vibes. 🌴
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN TOOL AREA ── */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-6">

        {/* ── Two-column editor ── */}
        {/* Desktop: controls left 40%, preview right 60% */}
        {/* Mobile: preview first (order-1), controls below (order-2) */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">

          {/* ════ LEFT: Controls (40%) ════ */}
          <div className="w-full lg:w-[40%] shrink-0 flex flex-col gap-3 order-2 lg:order-1">

            {/* Heading row — must align with PREVIEW heading on the right */}
            <div className="flex items-center gap-2 h-8">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#0E3B2E]/50 font-mono whitespace-nowrap">
                CONTROLS
              </span>
              <div className="flex-1 h-px bg-[#0E3B2E]/15" />
            </div>

            {/* Upload / Change Photo */}
            <PhotoUploader hasPhoto={!!userPhoto} onFileSelected={handleFileSelected} />

            {/* Adjust Photo */}
            {userPhoto && (
              <div className="border-2 border-[#0E3B2E] bg-[#FFF7E6] shadow-[3px_3px_0px_#0E3B2E]">
                <div className="border-b-2 border-[#0E3B2E] px-3 py-2 bg-[#145A3D]">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FFF7E6]/80 font-mono">
                    Adjust Photo
                  </span>
                </div>
                <div className="p-3">
                  <PhotoEditor transform={transform} onTransformChange={setTransform} />
                </div>
              </div>
            )}

            {/* Builder Details (Format B only) */}
            {format === "formatB" && (
              <div className="border-2 border-[#0E3B2E] bg-[#FFF7E6] shadow-[3px_3px_0px_#0E3B2E]">
                <div className="border-b-2 border-[#0E3B2E] px-3 py-2 bg-[#145A3D] flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FFF7E6]/80 font-mono">
                    Builder Details
                  </span>
                  <span className="bg-[#FFD21A] border border-[#0E3B2E] px-1.5 py-0.5 text-[9px] font-bold text-[#0E3B2E] tracking-wide">
                    ID CARD
                  </span>
                </div>
                <div className="p-3">
                  <BuilderForm details={builderDetails} onChange={setBuilderDetails} />
                </div>
              </div>
            )}

            {/* Export & Share */}
            <div className="border-2 border-[#0E3B2E] bg-[#FFF7E6] shadow-[3px_3px_0px_#0E3B2E]">
              <div className="border-b-2 border-[#0E3B2E] px-3 py-2 bg-[#FF2D85]">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FFF7E6] font-mono">
                  Export &amp; Share
                </span>
              </div>
              <div className="p-3">
                <ExportActions
                  format={format}
                  userPhoto={userPhoto}
                  transform={transform}
                  builderDetails={format === "formatB" ? builderDetails : undefined}
                />
              </div>
            </div>

          </div>

          {/* ════ RIGHT: Preview (60%) ════ */}
          <div className="w-full lg:flex-1 flex flex-col gap-3 order-1 lg:order-2 min-w-0">

            {/* Heading row — same h-8 height as CONTROLS heading, aligns on same baseline */}
            <div className="flex items-center gap-2 h-8">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#0E3B2E]/50 font-mono whitespace-nowrap">
                PREVIEW
              </span>
              <div className="flex-1 h-px bg-[#0E3B2E]/15" />
            </div>

            {/* Tabs + canvas + hint grouped together, centered, tabs match canvas width */}
            <div className="flex flex-col items-center gap-3">
              {/* FormatSelector constrained to canvas width */}
              <div
                style={{
                  width: format === "formatA"
                    ? `min(100%, calc(76vh * 1))`
                    : `min(100%, calc(76vh * ${(2048 / 3072).toFixed(6)}))`,
                }}
              >
                <FormatSelector selected={format} onChange={handleFormatChange} />
              </div>

              {/* Canvas */}
              <PreviewCanvas
                format={format}
                userPhoto={userPhoto}
                transform={transform}
                onTransformChange={setTransform}
                builderDetails={builderDetails}
              />

              {userPhoto && (
                <p className="text-[10px] text-[#0E3B2E]/30 font-mono text-center">
                  drag to reposition · pinch or slider to zoom
                </p>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ── BOTTOM CORNER DECORATIONS + FOOTER WRAPPER ── */}
      <div className="relative w-full mt-auto">

        {/* ── Bottom-left tropical corner (desktop only) ── */}
        <div className="absolute bottom-0 left-0 w-56 pointer-events-none hidden lg:block" style={{ zIndex: 5 }} aria-hidden="true">
          <svg viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Palm trunk */}
            <path d="M55 280 Q52 220 48 170 Q44 130 50 100" stroke="#0E3B2E" strokeWidth="6" strokeLinecap="round" fill="none"/>
            {/* Palm fronds */}
            <path d="M50 100 Q10 70 -10 38 Q22 58 50 100" fill="#145A3D"/>
            <path d="M50 100 Q2 85 -8 55 Q24 72 50 100" fill="#1a6b47"/>
            <path d="M50 100 Q28 52 38 18 Q48 58 50 100" fill="#145A3D"/>
            <path d="M50 100 Q78 55 100 38 Q76 68 50 100" fill="#1a6b47"/>
            <path d="M50 100 Q90 75 112 58 Q84 80 50 100" fill="#145A3D"/>
            <path d="M50 100 Q62 52 80 32 Q64 66 50 100" fill="#1a6b47"/>
            {/* Large monstera leaf 1 */}
            <path d="M0 240 Q-5 195 20 168 Q38 148 60 155 Q80 162 82 185 Q84 210 65 228 Q45 248 20 248 Z" fill="#145A3D" stroke="#0E3B2E" strokeWidth="1.5"/>
            <path d="M20 248 Q38 210 60 155" stroke="#FFF7E6" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
            <path d="M38 230 Q28 205 35 178" stroke="#FFF7E6" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
            <path d="M55 220 Q50 198 55 175" stroke="#FFF7E6" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
            {/* Monstera split notches */}
            <path d="M0 240 Q8 225 20 220" stroke="#0E3B2E" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M82 185 Q70 192 65 205" stroke="#0E3B2E" strokeWidth="1" fill="none" opacity="0.5"/>
            {/* Large monstera leaf 2 — overlapping */}
            <path d="M-10 270 Q-8 230 18 205 Q36 188 58 196 Q74 204 72 224 Q70 244 50 258 Q28 272 0 272 Z" fill="#1a6b47" stroke="#0E3B2E" strokeWidth="1.5"/>
            <path d="M0 272 Q30 235 58 196" stroke="#FFF7E6" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
            {/* Small leaf accent */}
            <path d="M85 245 Q78 225 88 208 Q98 195 108 202 Q116 210 110 228 Q104 244 90 248 Z" fill="#145A3D" stroke="#0E3B2E" strokeWidth="1.2"/>
            <path d="M90 248 Q96 225 108 202" stroke="#FFF7E6" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
            {/* Pink spark/star doodle */}
            <g transform="translate(118, 155)">
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#FF2D85" strokeWidth="2" strokeLinecap="round"/>
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#FF2D85" strokeWidth="2" strokeLinecap="round"/>
              <line x1="-7" y1="-7" x2="7" y2="7" stroke="#FF2D85" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="7" y1="-7" x2="-7" y2="7" stroke="#FF2D85" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
            {/* Small yellow dot accent */}
            <circle cx="105" cy="188" r="3.5" fill="#FFD21A" stroke="#0E3B2E" strokeWidth="1"/>
          </svg>
        </div>

        {/* ── Bottom-right tropical corner (desktop only) ── */}
        <div className="absolute bottom-0 right-0 w-64 pointer-events-none hidden lg:block" style={{ zIndex: 5 }} aria-hidden="true">
          <svg viewBox="0 0 250 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Palm trunk back */}
            <path d="M195 300 Q198 240 202 190 Q206 148 200 115" stroke="#0E3B2E" strokeWidth="5" strokeLinecap="round" fill="none"/>
            {/* Palm fronds back */}
            <path d="M200 115 Q240 82 262 48 Q230 68 200 115" fill="#145A3D"/>
            <path d="M200 115 Q248 98 260 66 Q228 82 200 115" fill="#1a6b47"/>
            <path d="M200 115 Q222 65 212 30 Q202 68 200 115" fill="#145A3D"/>
            <path d="M200 115 Q172 62 150 44 Q174 72 200 115" fill="#1a6b47"/>
            <path d="M200 115 Q160 88 138 68 Q166 88 200 115" fill="#145A3D"/>
            {/* Second palm trunk (smaller, front-left) */}
            <path d="M155 300 Q158 255 162 215 Q166 182 160 158" stroke="#0E3B2E" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M160 158 Q128 132 112 105 Q136 122 160 158" fill="#145A3D"/>
            <path d="M160 158 Q130 148 118 124 Q142 136 160 158" fill="#1a6b47"/>
            <path d="M160 158 Q148 118 152 92 Q158 124 160 158" fill="#145A3D"/>
            <path d="M160 158 Q182 122 196 104 Q178 128 160 158" fill="#1a6b47"/>
            {/* Large tropical leaf right */}
            <path d="M250 255 Q258 210 238 182 Q220 158 198 164 Q178 170 176 194 Q174 218 192 236 Q212 256 238 260 Z" fill="#145A3D" stroke="#0E3B2E" strokeWidth="1.5"/>
            <path d="M238 260 Q210 218 198 164" stroke="#FFF7E6" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
            <path d="M220 250 Q212 224 215 196" stroke="#FFF7E6" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
            <path d="M200 238 Q196 214 200 190" stroke="#FFF7E6" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
            {/* Monstera notches */}
            <path d="M250 255 Q240 242 228 238" stroke="#0E3B2E" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M176 194 Q186 200 190 212" stroke="#0E3B2E" strokeWidth="1" fill="none" opacity="0.5"/>
            {/* Overlapping leaf front */}
            <path d="M262 278 Q265 238 244 212 Q226 190 205 196 Q186 202 186 224 Q186 246 205 260 Q226 276 252 278 Z" fill="#1a6b47" stroke="#0E3B2E" strokeWidth="1.5"/>
            <path d="M252 278 Q222 240 205 196" stroke="#FFF7E6" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
            {/* Yellow surfboard */}
            <g transform="translate(118, 185) rotate(-22)">
              <ellipse cx="0" cy="0" rx="13" ry="52" fill="#FFD21A" stroke="#0E3B2E" strokeWidth="2"/>
              {/* Pink lightning bolt on surfboard */}
              <path d="M4 -18 L-3 -2 L3 -2 L-4 18" stroke="#FF2D85" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              {/* Fin */}
              <path d="M-6 38 Q-14 46 -10 54 Q-4 48 0 52" fill="#0E3B2E" stroke="#0E3B2E" strokeWidth="1"/>
            </g>
            {/* Cream/pink surfboard (smaller, behind) */}
            <g transform="translate(145, 210) rotate(15)">
              <ellipse cx="0" cy="0" rx="10" ry="40" fill="#FFF7E6" stroke="#0E3B2E" strokeWidth="1.8"/>
              <ellipse cx="0" cy="14" rx="5" ry="7" fill="#FF2D85" stroke="#0E3B2E" strokeWidth="1"/>
              <path d="M-5 30 Q-11 36 -8 42 Q-3 38 0 40" fill="#0E3B2E" stroke="#0E3B2E" strokeWidth="0.8"/>
            </g>
            {/* Small foliage sprigs */}
            <path d="M130 270 Q122 255 128 242 Q136 232 144 238 Q150 246 144 258 Q138 268 128 270 Z" fill="#145A3D" stroke="#0E3B2E" strokeWidth="1"/>
            <path d="M128 270 Q136 252 144 238" stroke="#FFF7E6" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
          </svg>
        </div>

        {/* ── FOOTER ── */}
        <footer className="relative w-full" style={{ zIndex: 10 }}>
          {/* Scalloped / wavy top edge */}
          <div className="w-full overflow-hidden leading-[0]" aria-hidden="true">
            <svg
              viewBox="0 0 1440 40"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full block"
              style={{ height: "40px" }}
            >
              <path
                d="M0,20 Q60,0 120,20 Q180,40 240,20 Q300,0 360,20 Q420,40 480,20 Q540,0 600,20 Q660,40 720,20 Q780,0 840,20 Q900,40 960,20 Q1020,0 1080,20 Q1140,40 1200,20 Q1260,0 1320,20 Q1380,40 1440,20 L1440,40 L0,40 Z"
                fill="#0F3D2E"
              />
            </svg>
          </div>

          {/* Footer body */}
          <div className="bg-[#0F3D2E] w-full">
            {/* Yellow accent line */}
            <div className="w-full h-[3px] bg-[#FFD21A]" />

            <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* LEFT */}
              <p className="text-[#FFF7E6]/80 text-[13px] font-mono tracking-wide text-center sm:text-left">
                🌴 Building. Hacking. Beaching. 💗
              </p>

              {/* CENTER */}
              <div className="flex flex-col items-center gap-2">
                {/* Social icons */}
                <div className="flex items-center gap-4">
                  {/* X / Twitter */}
                  <a
                    href="https://x.com/hackerhousegoa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                    className="text-[#FFF7E6]/50 hover:text-[#FFD21A] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/hackerhousegoa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-[#FFF7E6]/50 hover:text-[#FF2D85] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                    </svg>
                  </a>
                  {/* GitHub */}
                  <a
                    href="https://github.com/hackerhousegoa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-[#FFF7E6]/50 hover:text-[#FFF7E6] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  </a>
                </div>
                <p className="text-[#FFF7E6]/35 text-[11px] font-mono tracking-widest text-center">
                  © HH Goa 2026. All rights reserved.
                </p>
              </div>

              {/* RIGHT */}
              <p className="text-[#FFD21A] text-[13px] font-mono font-bold tracking-wide text-center sm:text-right">
                Made with 💛 in Goa
              </p>

            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
