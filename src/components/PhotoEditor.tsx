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
        <ZoomOut size={15} className="text-[#FEE101]/50 shrink-0" />
        <input
          id="zoom-slider"
          type="range"
          min="0.5"
          max="3"
          step="0.01"
          value={transform.scale}
          onChange={handleZoomChange}
          className="hh-slider flex-1"
        />
        <ZoomIn size={15} className="text-[#FEE101]/50 shrink-0" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[#FFFBE8]/40 text-[10px] font-victor">
          <Move size={11} />
          <span>Drag photo to reposition</span>
        </div>
        <button
          id="reset-transform-btn"
          onClick={handleReset}
          className="hh-btn hh-btn-secondary px-3 py-1.5 text-[10px]"
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>
    </div>
  );
}
