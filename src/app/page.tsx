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
      <div className="min-h-screen flex items-center justify-center bg-poster">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[#FEE101] border-t-[#FF1684] rounded-full animate-spin" />
          <p className="font-victor text-[#FEE101]/60 text-[11px] font-bold tracking-[0.25em] uppercase">
            Loading HH Goa assets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-poster text-[#FFFBE8] flex flex-col">

      {/* ══════════════════════════════════════════
          FIXED TROPICAL CORNER DECORATIONS
      ══════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">

        {/* Palm tree — far left */}
        <svg className="absolute -left-6 top-0 w-40 opacity-[0.12] hidden lg:block" viewBox="0 0 130 380" fill="none">
          <path d="M68 380 Q65 280 62 200 Q58 140 62 100" stroke="#FEE101" strokeWidth="5" strokeLinecap="round"/>
          <path d="M62 100 Q14 62 -8 22 Q28 48 62 100" fill="#0B6839"/>
          <path d="M62 100 Q4 80 -6 48 Q30 68 62 100" fill="#1a7a45"/>
          <path d="M62 100 Q36 44 48 8 Q58 52 62 100" fill="#0B6839"/>
          <path d="M62 100 Q92 52 118 34 Q88 64 62 100" fill="#1a7a45"/>
          <path d="M62 100 Q106 72 124 50 Q92 76 62 100" fill="#0B6839"/>
          <path d="M62 100 Q72 46 88 22 Q70 60 62 100" fill="#1a7a45"/>
        </svg>

        {/* Palm tree — far right */}
        <svg className="absolute -right-6 top-0 w-36 opacity-[0.12] hidden lg:block scale-x-[-1]" viewBox="0 0 130 380" fill="none">
          <path d="M68 380 Q65 280 62 200 Q58 140 62 100" stroke="#FEE101" strokeWidth="5" strokeLinecap="round"/>
          <path d="M62 100 Q14 62 -8 22 Q28 48 62 100" fill="#0B6839"/>
          <path d="M62 100 Q4 80 -6 48 Q30 68 62 100" fill="#1a7a45"/>
          <path d="M62 100 Q36 44 48 8 Q58 52 62 100" fill="#0B6839"/>
          <path d="M62 100 Q92 52 118 34 Q88 64 62 100" fill="#1a7a45"/>
          <path d="M62 100 Q106 72 124 50 Q92 76 62 100" fill="#0B6839"/>
        </svg>

        {/* Sun — top center-right */}
        <svg className="absolute right-[12%] top-6 w-24 opacity-[0.13] hidden md:block" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="18" fill="#FEE101"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
            <line key={i}
              x1={48 + 22 * Math.cos((deg * Math.PI) / 180)}
              y1={48 + 22 * Math.sin((deg * Math.PI) / 180)}
              x2={48 + 34 * Math.cos((deg * Math.PI) / 180)}
              y2={48 + 34 * Math.sin((deg * Math.PI) / 180)}
              stroke="#FEE101" strokeWidth="2.5" strokeLinecap="round"
            />
          ))}
        </svg>

        {/* Wave lines — bottom */}
        <svg className="absolute left-0 right-0 bottom-32 w-full opacity-[0.06]" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none">
          <path d="M0 30 Q90 10 180 30 Q270 50 360 30 Q450 10 540 30 Q630 50 720 30 Q810 10 900 30 Q990 50 1080 30 Q1170 10 1260 30 Q1350 50 1440 30" stroke="#FEE101" strokeWidth="2"/>
          <path d="M0 44 Q90 24 180 44 Q270 64 360 44 Q450 24 540 44 Q630 64 720 44 Q810 24 900 44 Q990 64 1080 44 Q1170 24 1260 44 Q1350 64 1440 44" stroke="#FEE101" strokeWidth="1.5"/>
        </svg>

        {/* Pink star — top left area */}
        <svg className="absolute left-[8%] top-[18%] w-10 opacity-[0.18] hidden md:block" viewBox="0 0 40 40" fill="none">
          <line x1="20" y1="2" x2="20" y2="38" stroke="#FF1684" strokeWidth="3" strokeLinecap="round"/>
          <line x1="2" y1="20" x2="38" y2="20" stroke="#FF1684" strokeWidth="3" strokeLinecap="round"/>
          <line x1="6" y1="6" x2="34" y2="34" stroke="#FF1684" strokeWidth="2" strokeLinecap="round"/>
          <line x1="34" y1="6" x2="6" y2="34" stroke="#FF1684" strokeWidth="2" strokeLinecap="round"/>
        </svg>

        {/* Surfboard — bottom right */}
        <svg className="absolute right-[6%] bottom-[18%] w-12 opacity-[0.14] rotate-[-20deg] hidden lg:block" viewBox="0 0 40 120" fill="none">
          <ellipse cx="20" cy="55" rx="12" ry="50" fill="#FF1684" stroke="#000" strokeWidth="2"/>
          <ellipse cx="20" cy="90" rx="5" ry="7" fill="#FEE101" stroke="#000" strokeWidth="1.5"/>
          <path d="M14 20 L20 8 L26 20" stroke="#FEE101" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>

        {/* Small yellow dot cluster — right side */}
        <svg className="absolute right-[4%] top-[40%] w-16 opacity-[0.15] hidden lg:block" viewBox="0 0 60 80" fill="none">
          <circle cx="10" cy="10" r="4" fill="#FEE101"/>
          <circle cx="30" cy="6" r="3" fill="#FEE101"/>
          <circle cx="50" cy="12" r="5" fill="#FEE101"/>
          <circle cx="20" cy="28" r="3" fill="#FF1684"/>
          <circle cx="44" cy="30" r="4" fill="#FEE101"/>
          <circle cx="8" cy="44" r="5" fill="#FEE101"/>
          <circle cx="32" cy="50" r="3" fill="#FF1684"/>
          <circle cx="52" cy="46" r="4" fill="#FEE101"/>
        </svg>

        {/* Leaf accent — left mid */}
        <svg className="absolute left-[3%] top-[55%] w-20 opacity-[0.10] hidden lg:block rotate-[15deg]" viewBox="0 0 80 120" fill="none">
          <path d="M40 115 Q10 80 12 45 Q14 15 40 5 Q66 15 68 45 Q70 80 40 115Z" fill="#0B6839" stroke="#FEE101" strokeWidth="1.5"/>
          <path d="M40 115 Q40 60 40 5" stroke="#FEE101" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          <path d="M40 80 Q20 65 15 45" stroke="#FEE101" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
          <path d="M40 80 Q60 65 65 45" stroke="#FEE101" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
        </svg>

      </div>

      {/* ══════════════════════════════════════════
          HEADER — minimal, integrated into poster
      ══════════════════════════════════════════ */}
      <Header />

      {/* ══════════════════════════════════════════
          HERO — POSTER BRANDING BLOCK
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden border-b-[3px] border-[#FEE101]">

        {/* Very subtle large background text watermark */}
        <div
          className="absolute inset-0 flex items-end justify-center pointer-events-none select-none overflow-hidden pb-0"
          aria-hidden="true"
        >
          <span
            className="font-imbue text-[#0B6839] opacity-[0.18] whitespace-nowrap leading-none"
            style={{ fontSize: "clamp(8rem, 28vw, 22rem)", letterSpacing: "-0.04em", lineHeight: 0.85 }}
          >
            GOA
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-5 md:pt-8 md:pb-6">

          {/* ── Main poster heading ── */}
          <div className="relative flex flex-col items-center text-center mb-4">

            {/* Small eyebrow */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-[#FF1684] inline-block" />
              <span className="font-victor text-[10px] font-bold tracking-[0.3em] uppercase text-[#FEE101]/60">
                Frame Generator · 2026
              </span>
              <span className="w-8 h-[2px] bg-[#FF1684] inline-block" />
            </div>

            {/* ── Hero brand: PNG base + floating SVG overlay ── */}
            <div
              className="relative w-full max-w-[1800px] mx-auto"
              aria-label="Hacker House Goa"
            >
              {/* HACKER HOUSE PNG — static, never animates */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/Hacker house.png"
                alt="HACKER HOUSE"
                className="block w-full h-auto select-none"
                draggable={false}
              />

              {/* गोवा SVG — floats independently, never shifts layout */}
              <img
                src="/assets/goa_hindi.svg"
                alt="गोवा"
                aria-hidden="true"
                draggable={false}
                className="goa-sticker pointer-events-none select-none absolute"
                style={{
                  left: "50%",
                  top: "52%",
                  width: "clamp(80px, 22%, 160px)",
                  height: "auto",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            {/* Sub-label */}
            <div className="mt-3 flex items-center gap-3">
              <span className="w-12 h-[1px] bg-[#FEE101]/30 inline-block" />
              <span className="font-victor text-[11px] font-bold tracking-[0.25em] uppercase text-[#FFFBE8]/50">
                HH Goa 2026 · Frame Builder
              </span>
              <span className="w-12 h-[1px] bg-[#FEE101]/30 inline-block" />
            </div>

          </div>

          {/* ── Descriptor row ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <p className="font-victor text-[12px] text-[#FFFBE8]/50 text-center">
              Upload a photo · Pick a format · Get your tropical hacker identity
            </p>
            <span className="hidden sm:block w-[1px] h-4 bg-[#FEE101]/20" />
            <p className="font-victor text-[12px] text-[#FF1684] font-bold text-center">
              No login. No tracking. Just vibes. 🌴
            </p>
          </div>

        </div>

        {/* Yellow bottom rule with pink dot accent */}
        <div className="relative h-[3px] bg-[#FEE101]">
          <span className="absolute left-1/2 -translate-x-1/2 -top-[5px] w-[13px] h-[13px] rounded-full bg-[#FF1684] border-2 border-[#000] inline-block" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MAIN TOOL AREA
      ══════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-8">

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-7">

          {/* ════ LEFT: Controls (40%) ════ */}
          <div className="w-full lg:w-[40%] shrink-0 flex flex-col gap-3 order-2 lg:order-1">

            {/* Section label */}
            <div className="hh-section-label">
              <span className="hh-section-label-text">Controls</span>
              <div className="hh-section-label-line" />
              <span className="w-2 h-2 bg-[#FEE101] border border-[#000] inline-block shrink-0" />
            </div>

            {/* Upload / Change Photo */}
            <PhotoUploader hasPhoto={!!userPhoto} onFileSelected={handleFileSelected} />

            {/* Adjust Photo */}
            {userPhoto && (
              <div className="hh-panel">
                <div className="hh-panel-header">
                  <span>Adjust Photo</span>
                  <span className="ml-auto w-2 h-2 bg-[#FEE101] inline-block shrink-0" />
                </div>
                <div className="hh-panel-body">
                  <PhotoEditor transform={transform} onTransformChange={setTransform} />
                </div>
              </div>
            )}

            {/* Builder Details (Format B only) */}
            {format === "formatB" && (
              <div className="hh-panel">
                <div className="hh-panel-header">
                  <span>Builder Details</span>
                  <span className="ml-auto bg-[#FEE101] border border-[#000] px-1.5 py-0.5 text-[9px] font-bold text-[#075C35] tracking-wide font-victor shrink-0">
                    ID CARD
                  </span>
                </div>
                <div className="hh-panel-body">
                  <BuilderForm details={builderDetails} onChange={setBuilderDetails} />
                </div>
              </div>
            )}

            {/* Export & Share */}
            <div className="hh-panel">
              <div className="hh-panel-header" style={{ background: "#FF1684", borderBottomColor: "#000" }}>
                <span style={{ color: "#fff" }}>Export &amp; Share</span>
                <span className="ml-auto w-2 h-2 bg-[#FEE101] inline-block shrink-0" />
              </div>
              <div className="hh-panel-body">
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

            {/* Section label */}
            <div className="hh-section-label">
              <span className="hh-section-label-text">Preview</span>
              <div className="hh-section-label-line" />
              <span className="w-2 h-2 bg-[#FF1684] border border-[#000] inline-block shrink-0" />
            </div>

            {/* Tabs + canvas + hint */}
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
                <p className="font-victor text-[10px] text-[#FEE101]/30 text-center">
                  drag to reposition · pinch or slider to zoom
                </p>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="relative w-full border-t-[3px] border-[#FEE101] bg-[#042e1a]">

        {/* Yellow top accent line */}
        <div className="w-full h-[2px] bg-[#FEE101]/20" />

        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Left */}
          <p className="font-victor text-[#FFFBE8]/60 text-[12px] tracking-wide text-center sm:text-left">
            🌴 Building. Hacking. Beaching. 💗
          </p>

          {/* Center */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <a href="https://x.com/hackerhousegoa" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"
                className="text-[#FFFBE8]/40 hover:text-[#FEE101] transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com/hackerhousegoa" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="text-[#FFFBE8]/40 hover:text-[#FF1684] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://github.com/hackerhousegoa" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="text-[#FFFBE8]/40 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </div>
            <p className="font-victor text-[#FFFBE8]/25 text-[10px] tracking-widest text-center">
              © HH Goa 2026. All rights reserved.
            </p>
          </div>

          {/* Right */}
          <p className="font-victor text-[#FEE101] text-[12px] font-bold tracking-wide text-center sm:text-right">
            Made with 💛 in Goa
          </p>

        </div>
      </footer>

    </div>
  );
}
