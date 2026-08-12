"use client";

import React, { useState, useCallback } from "react";
import { Download, Share2, Check, Loader2 } from "lucide-react";

// X (formerly Twitter) logo as inline SVG since lucide-react removed the Twitter icon
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import type { FormatType, TransformState, BuilderDetails } from "@/lib/types";
import { exportCanvasPNG } from "@/lib/canvas";

interface ExportActionsProps {
  format: FormatType;
  userPhoto: HTMLImageElement | null;
  transform: TransformState;
  builderDetails?: BuilderDetails;
}

export default function ExportActions({
  format,
  userPhoto,
  transform,
  builderDetails,
}: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const getFilename = () => {
    if (format === "formatB" && builderDetails?.name) {
      const safeName = builderDetails.name.replace(/[^a-zA-Z0-9]/g, "-");
      return `HH-Goa-2026-${safeName}.png`;
    }
    return "HH-Goa-2026-FrameInGoa.png";
  };

  const handleDownload = useCallback(async () => {
    if (!userPhoto || isExporting) return;
    setIsExporting(true);
    try {
      const blob = await exportCanvasPNG(
        format,
        userPhoto,
        transform,
        builderDetails
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getFilename();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 2500);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsExporting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, userPhoto, transform, builderDetails, isExporting]);

  const handleShare = useCallback(async () => {
    if (!userPhoto) return;
    const shareText =
      "Framing my builder moment in Goa 🌴💻\n\nHH Goa 2026\n\n#FrameInGoa";

    try {
      const blob = await exportCanvasPNG(
        format,
        userPhoto,
        transform,
        builderDetails
      );
      const file = new File([blob], getFilename(), { type: "image/png" });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          text: shareText,
        });
        return;
      }
    } catch (err) {
      // User cancelled or share failed, fall through to X intent
      console.log("Web Share cancelled or failed:", err);
    }

    // Fallback: open X/Twitter intent
    handleShareToX();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, userPhoto, transform, builderDetails]);

  function handleShareToX() {
    const text = encodeURIComponent(
      "Framing my builder moment in Goa 🌴💻\n\nHH Goa 2026\n\n#FrameInGoa"
    );
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const disabled = !userPhoto;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Download */}
      <button
        id="download-png-btn"
        onClick={handleDownload}
        disabled={disabled || isExporting}
        className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base tracking-wide transition-all duration-300 cursor-pointer ${
          disabled
            ? "bg-[#145A3D]/10 text-[#145A3D]/35 cursor-not-allowed"
            : downloadDone
              ? "bg-[#145A3D] text-[#FFF7E6] shadow-[4px_4px_0_#FF2D85]"
              : "bg-[#FFD21A] text-[#0E3B2E] hover:bg-[#FF2D85] hover:text-white shadow-[4px_4px_0_#0E3B2E]"
        }`}
      >
        {isExporting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : downloadDone ? (
          <Check size={20} />
        ) : (
          <Download size={20} />
        )}
        {isExporting
          ? "Generating..."
          : downloadDone
            ? "Downloaded!"
            : "DOWNLOAD PNG"}
      </button>

      {/* Share row */}
      <div className="flex gap-3">
        <button
          id="share-btn"
          onClick={handleShare}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer ${
            disabled
            ? "bg-[#145A3D]/10 text-[#145A3D]/35 cursor-not-allowed"
              : "bg-[#145A3D] border border-[#0E3B2E] text-[#FFF7E6] hover:bg-[#FFD21A] hover:text-[#0E3B2E]"
          }`}
        >
          <Share2 size={16} />
          Share
        </button>
        <button
          id="share-x-btn"
          onClick={handleShareToX}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer ${
            disabled
            ? "bg-[#145A3D]/10 text-[#145A3D]/35 cursor-not-allowed"
              : "bg-[#FF2D85] border border-[#0E3B2E] text-white hover:bg-[#FFD21A] hover:text-[#0E3B2E]"
          }`}
        >
          <XIcon size={16} />
          Share to X
        </button>
      </div>
    </div>
  );
}
