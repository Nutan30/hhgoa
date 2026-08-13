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
    const text = encodeURIComponent("🌴 My Hacker Goa Builder Card is ready!\n\nLooking forward to meeting passionate builders, sharing ideas, and creating something amazing in Goa. 🚀\n\nGet yours:\nhttps://hhgoa-flax.vercel.app\n\n#FrameInGoa #HHGoa2026");
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const disabled = !userPhoto;

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Download — full width, primary yellow */}
      <button
        id="download-png-btn"
        onClick={handleDownload}
        disabled={disabled || isExporting}
        className={`hh-btn w-full py-3 text-[11px] ${
          disabled || isExporting
            ? "hh-btn hh-btn-primary opacity-35 cursor-not-allowed"
            : downloadDone
              ? "hh-btn bg-[#0B6839] text-white border-[#0B2818] shadow-[4px_4px_0px_#0B2818]"
              : "hh-btn hh-btn-primary"
        }`}
      >
        {isExporting ? <Loader2 size={17} className="animate-spin" /> : downloadDone ? <Check size={17} /> : <Download size={17} />}
        {isExporting ? "Generating..." : downloadDone ? "Downloaded!" : "Download PNG"}
      </button>

      {/* Share row */}
      <div className="flex gap-2">
        <button
          id="share-btn"
          onClick={handleShare}
          disabled={disabled}
          className="hh-btn hh-btn-secondary flex-1 py-3 text-[11px]"
        >
          <Share2 size={15} />
          Share
        </button>
        <button
          id="share-x-btn"
          onClick={handleShareToX}
          disabled={disabled}
          className="hh-btn hh-btn-pink flex-1 py-3 text-[11px]"
        >
          <XIcon size={15} />
          Share to X
        </button>
      </div>
    </div>
  );
}
