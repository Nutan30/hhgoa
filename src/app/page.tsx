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
  const [transform, setTransform] = useState<TransformState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const [builderDetails, setBuilderDetails] = useState<BuilderDetails>({
    name: "",
    stack: "",
    title: "",
  });
  const [overlaysReady, setOverlaysReady] = useState(false);

  // Preload overlay assets on mount
  useEffect(() => {
    preloadOverlays()
      .then(() => setOverlaysReady(true))
      .catch((err) => console.error("Failed to preload overlays:", err));
  }, []);

  // Handle file upload
  const handleFileSelected = useCallback(
    async (file: File) => {
      try {
        // Revoke previous URL
        if (photoUrl) URL.revokeObjectURL(photoUrl);

        const url = await processUploadedFile(file);
        setPhotoUrl(url);
        const img = await loadImage(url);
        setUserPhoto(img);
        // Reset transform on new photo
        setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
      } catch (err) {
        console.error("Failed to process photo:", err);
      }
    },
    [photoUrl]
  );

  // Reset transform when format changes
  const handleFormatChange = useCallback((f: FormatType) => {
    setFormat(f);
    setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
  }, []);

  if (!overlaysReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6] text-[#0E3B2E]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#0E3B2E]/20 border-t-[#FF2D85] rounded-full animate-spin" />
          <p className="text-[#0E3B2E]/60 text-sm font-bold tracking-wide">
            Loading HH Goa assets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden text-[#0E3B2E]">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <span className="doodle hidden md:block top-44 left-[3%] text-7xl text-[#145A3D]/20 -rotate-12">🌴</span>
        <span className="doodle hidden lg:block top-[36%] right-[3%] text-6xl text-[#FF2D85]/25 rotate-12">☀</span>
        <span className="doodle hidden md:block bottom-16 left-[6%] text-5xl text-[#FFD21A] rotate-[-20deg]">〰〰</span>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Main content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-10">
          <section className="relative pt-2 pb-7 md:pb-9 text-center">
            <p className="inline-block bg-[#FFD21A] px-3 py-1 text-xs font-black tracking-[0.18em] uppercase -rotate-1 border border-[#0E3B2E]">Make it yours</p>
            <h2 className="poster-title mt-3 text-6xl leading-[0.78] sm:text-7xl md:text-8xl">
              <span className="block text-[#145A3D]">FRAME YOUR</span>
              <span className="block text-[#FF2D85]">BUILDER</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-28 bg-[#FFD21A] border border-[#0E3B2E]" />
          </section>
          {/* Format selector */}
          <div className="mb-6">
            <FormatSelector selected={format} onChange={handleFormatChange} />
          </div>

          {/* Desktop: side-by-side | Mobile: stacked */}
          <div className="flex flex-col lg:flex-row gap-7 lg:gap-8">
            {/* Preview column */}
            <div className="w-full lg:flex-1 lg:max-w-[560px]">
              <PreviewCanvas
                format={format}
                userPhoto={userPhoto}
                transform={transform}
                onTransformChange={setTransform}
                builderDetails={builderDetails}
              />
            </div>

            {/* Controls column */}
            <div className="w-full lg:w-[360px] flex flex-col gap-5">
              {/* Upload */}
              <PhotoUploader
                hasPhoto={!!userPhoto}
                onFileSelected={handleFileSelected}
              />

              {/* Photo controls (only show when photo is uploaded) */}
              {userPhoto && (
                <PhotoEditor
                  transform={transform}
                  onTransformChange={setTransform}
                />
              )}

              {/* Builder form (only for Format B) */}
              {format === "formatB" && (
                <div className="pt-4 border-t border-[#0E3B2E]/20">
                  <h3 className="text-xs font-black tracking-[0.16em] uppercase text-[#145A3D] mb-3">
                    Builder Details
                  </h3>
                  <BuilderForm
                    details={builderDetails}
                    onChange={setBuilderDetails}
                  />
                </div>
              )}

              {/* Export actions */}
              <div className="pt-2">
                <ExportActions
                  format={format}
                  userPhoto={userPhoto}
                  transform={transform}
                  builderDetails={
                    format === "formatB" ? builderDetails : undefined
                  }
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-4 text-center py-5 px-4 bg-[#0E3B2E] text-[#FFF7E6]/80 text-xs border-t-4 border-[#FFD21A]">
          <p>
            HH Goa 2026 • Frame in Goa •{" "}
            <span className="text-[#FF3B81]/50">#FrameInGoa</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
