"use client";

import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react";
import type { TransformState } from "@/lib/types";

interface PhotoEditorProps {
  transform: TransformState;
  onTransformChange: (t: TransformState) => void;
}

export default function PhotoEditor({
  transform,
  onTransformChange,
}: PhotoEditorProps) {
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
        <ZoomOut size={16} className="text-white/50 shrink-0" />
        <input
          id="zoom-slider"
          type="range"
          min="0.5"
          max="3"
          step="0.01"
          value={transform.scale}
          onChange={handleZoomChange}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-white/10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#FFE853]
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,232,83,0.5)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-track]:rounded-full
            [&::-moz-range-track]:bg-white/10
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#FFE853]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <ZoomIn size={16} className="text-white/50 shrink-0" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <Move size={12} />
          <span>Drag photo to reposition</span>
        </div>
        <button
          id="reset-transform-btn"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-all cursor-pointer"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>
    </div>
  );
}
