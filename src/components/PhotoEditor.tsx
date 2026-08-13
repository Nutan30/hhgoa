"use client";

import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react";
import type { TransformState } from "@/lib/types";

interface PhotoEditorProps {
  transform: TransformState;
  onTransformChange: (t: TransformState) => void;
}

export default function PhotoEditor({ transform, onTransformChange }: PhotoEditorProps) {
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTransformChange({ ...transform, scale: parseFloat(e.target.value) });
  };

  const handleReset = () => {
    onTransformChange({ scale: 1, offsetX: 0, offsetY: 0 });
  };

  return (
    <div className="w-full space-y-3">
      {/* Zoom control */}
      <div className="flex items-center gap-3">
        <ZoomOut size={16} className="text-[#0E3B2E]/50 shrink-0" />
        <input
          id="zoom-slider"
          type="range"
          min="0.5"
          max="3"
          step="0.01"
          value={transform.scale}
          onChange={handleZoomChange}
          className="flex-1 h-2 rounded-none appearance-none cursor-pointer accent-[#145A3D]
            [&::-webkit-slider-runnable-track]:rounded-none
            [&::-webkit-slider-runnable-track]:bg-[#0E3B2E]/20
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-none
            [&::-webkit-slider-thumb]:bg-[#FFD21A]
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#0E3B2E]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-track]:rounded-none
            [&::-moz-range-track]:bg-[#0E3B2E]/20
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-none
            [&::-moz-range-thumb]:bg-[#FFD21A]
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#0E3B2E]
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <ZoomIn size={16} className="text-[#0E3B2E]/50 shrink-0" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[#0E3B2E]/40 text-xs font-mono">
          <Move size={12} />
          <span>Drag photo to reposition</span>
        </div>
        <button
          id="reset-transform-btn"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#0E3B2E] bg-[#FFF7E6] hover:bg-[#FFD21A]/40 text-[#0E3B2E] text-xs font-bold tracking-wide transition-all cursor-pointer shadow-[2px_2px_0px_#0E3B2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>
    </div>
  );
}
