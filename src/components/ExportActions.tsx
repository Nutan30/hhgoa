"use client";

import React, { useState, useCallback } from "react";
import { Download, Share2, Check, Loader2 } from "lucide-react";

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

export default function ExportActions({ format, userPhoto, transform, builderDetails }: ExportActionsProps) {
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
      const blob = await exportCanvasPNG(format, userPhoto, transform, builderDetails);
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
      console.error("Download failed:", String(err).replace(/[\r\n]/g, " "));
    } finally {
      setIsExporting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, userPhoto, transform, builderDetails, isExporting]);

  const handleShare = useCallback(async () => {
    if (!userPhoto) return;
    const shareText = "Framing my builder moment in Goa 🌴💻\n\nHH Goa 2026\n\n#FrameInGoa";
    try {
      const blob = await exportCanvasPNG(format, userPhoto, transform, builderDetails);
      const file = new File([blob], getFilename(), { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
        return;
      }
    } catch (err) {
      console.log("Web Share cancelled or failed:", String(err).replace(/[\r\n]/g, " "));
    }
    handleShareToX();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, userPhoto, transform, builderDetails]);

  const handleShareToX = () => {
    const text = encodeURIComponent("Framing my builder moment in Goa 🌴💻\n\nHH Goa 2026\n\n#FrameInGoa");
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const disabled = !userPhoto;

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Download — full width */}
      <button
        id="download-png-btn"
        onClick={handleDownload}
        disabled={disabled || isExporting}
        className={`w-full flex items-center justify-center gap-2 py-3 px-5 font-bold text-sm tracking-widest uppercase transition-all duration-200 border-2 cursor-pointer ${
          disabled
            ? "bg-[#0E3B2E]/10 text-[#0E3B2E]/30 border-[#0E3B2E]/20 cursor-not-allowed"
            : downloadDone
              ? "bg-[#145A3D] text-[#FFF7E6] border-[#0E3B2E] shadow-[3px_3px_0px_#0E3B2E]"
              : "bg-[#FFD21A] text-[#0E3B2E] border-[#0E3B2E] shadow-[3px_3px_0px_#0E3B2E] hover:bg-[#FFD21A]/80 active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
        }`}
      >
        {isExporting ? <Loader2 size={18} className="animate-spin" /> : downloadDone ? <Check size={18} /> : <Download size={18} />}
        {isExporting ? "Generating..." : downloadDone ? "Downloaded!" : "Download PNG"}
      </button>

      {/* Share row — equal width buttons, same height as Download */}
      <div className="flex gap-2">
        <button
          id="share-btn"
          onClick={handleShare}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 font-bold text-sm tracking-wide uppercase transition-all duration-200 border-2 cursor-pointer ${
            disabled
              ? "bg-[#0E3B2E]/10 text-[#0E3B2E]/30 border-[#0E3B2E]/20 cursor-not-allowed"
              : "bg-[#FFF7E6] text-[#0E3B2E] border-[#0E3B2E] hover:bg-[#145A3D]/10 shadow-[2px_2px_0px_#0E3B2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          }`}
        >
          <Share2 size={16} />
          Share
        </button>
        <button
          id="share-x-btn"
          onClick={handleShareToX}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 font-bold text-sm tracking-wide uppercase transition-all duration-200 border-2 cursor-pointer ${
            disabled
              ? "bg-[#0E3B2E]/10 text-[#0E3B2E]/30 border-[#0E3B2E]/20 cursor-not-allowed"
              : "bg-[#FF2D85] text-[#FFF7E6] border-[#0E3B2E] hover:bg-[#FF2D85]/80 shadow-[2px_2px_0px_#0E3B2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          }`}
        >
          <XIcon size={16} />
          Share to X
        </button>
      </div>
    </div>
  );
}
