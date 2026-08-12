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
      <div className="min-h-screen flex items-center justify-center bg-[#021a12]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#FFE853]/30 border-t-[#FFE853] rounded-full animate-spin" />
          <p className="text-white/50 text-sm font-medium">
            Loading HH Goa assets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021a12] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[#0a5d30]/20 blur-[120px]" />
        <div className="absolute -bottom-1/3 -right-1/4 w-[600px] h-[600px] rounded-full bg-[#FF3B81]/8 blur-[100px]" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#FFE853]/5 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Main content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-8">
          {/* Format selector */}
          <div className="mb-6">
            <FormatSelector selected={format} onChange={handleFormatChange} />
          </div>

          {/* Desktop: side-by-side | Mobile: stacked */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
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
                <div className="pt-2 border-t border-white/5">
                  <h3 className="text-xs font-semibold tracking-wider uppercase text-[#FFE853]/70 mb-3">
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
        <footer className="text-center py-4 text-white/20 text-xs">
          <p>
            HH Goa 2026 • Frame in Goa •{" "}
            <span className="text-[#FF3B81]/50">#FrameInGoa</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
