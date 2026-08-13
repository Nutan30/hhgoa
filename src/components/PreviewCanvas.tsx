"use client";

import React, { useRef, useEffect, useCallback } from "react";
import type { FormatType, TransformState, BuilderDetails } from "@/lib/types";
import { FORMAT_A_GEOMETRY, FORMAT_B_GEOMETRY } from "@/lib/types";
import { renderFrame } from "@/lib/canvas";

interface PreviewCanvasProps {
  format: FormatType;
  userPhoto: HTMLImageElement | null;
  transform: TransformState;
  onTransformChange: (t: TransformState) => void;
  builderDetails?: BuilderDetails;
}

export default function PreviewCanvas({
  format,
  userPhoto,
  transform,
  onTransformChange,
  builderDetails,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(0);
  const lastPinchMid = useRef({ x: 0, y: 0 });
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const geo = format === "formatA" ? FORMAT_A_GEOMETRY : FORMAT_B_GEOMETRY;

  const getDisplayScale = useCallback((): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 1;
    const displayWidth = canvas.getBoundingClientRect().width;
    return geo.overlayWidth / displayWidth;
  }, [geo.overlayWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderFrame(canvas, format, userPhoto, transform, builderDetails);
  }, [format, userPhoto, transform, builderDetails]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!userPhoto) return;
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    },
    [userPhoto]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      const scale = getDisplayScale();
      const dx = (e.clientX - lastPointer.current.x) * scale;
      const dy = (e.clientY - lastPointer.current.y) * scale;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      const t = transformRef.current;
      onTransformChange({ ...t, offsetX: t.offsetX + dx, offsetY: t.offsetY + dy });
    },
    [getDisplayScale, onTransformChange]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // On touch devices, only intercept 2-finger pinch so the page can
      // scroll naturally with a single finger.
      if (!userPhoto) return;
      if (e.touches.length === 1) {
        // Single finger: let the browser handle scroll — do not drag.
        return;
      } else if (e.touches.length === 2) {
        e.preventDefault();
        isDragging.current = false;
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastPinchDist.current = dist;
        lastPinchMid.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      }
    },
    [userPhoto]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const t = transformRef.current;
      if (e.touches.length === 1) {
        // Single finger: allow the page to scroll.
        return;
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const mid = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };

        let next = t;
        // Pinch zoom based on change in distance between fingers
        if (lastPinchDist.current > 0) {
          const pinchScale = dist / lastPinchDist.current;
          const newScale = Math.max(0.5, Math.min(3, t.scale * pinchScale));
          next = { ...next, scale: newScale };
        }
        // Two-finger pan: translate by midpoint movement
        const displayScale = getDisplayScale();
        const dx = (mid.x - lastPinchMid.current.x) * displayScale;
        const dy = (mid.y - lastPinchMid.current.y) * displayScale;
        if (dx !== 0 || dy !== 0) {
          next = { ...next, offsetX: next.offsetX + dx, offsetY: next.offsetY + dy };
        }

        lastPinchDist.current = dist;
        lastPinchMid.current = mid;
        onTransformChange(next);
      }
    },
    [getDisplayScale, onTransformChange]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    lastPinchDist.current = 0;
  }, []);

  const aspectRatio = geo.overlayWidth / geo.overlayHeight;

  return (
    <div
      ref={containerRef}
      className="relative border-[3px] border-[#FEE101] shadow-[6px_6px_0px_#000]"
      style={{
        aspectRatio: `${aspectRatio}`,
        maxHeight: "76vh",
        width: `min(100%, calc(76vh * ${aspectRatio}))`,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ display: "block" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {!userPhoto && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div
              className="rounded-full border-2 border-dashed border-[#0B6839]/25 flex items-center justify-center"
              style={{ width: "22%", aspectRatio: "1" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2 opacity-20 translate-y-[-25px]">
                <circle cx="12" cy="8" r="4" stroke="#FEE101" strokeWidth="1.5"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#FEE101" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[#FEE101]/30 text-[8px] font-victor tracking-wide translate-y-[-40px]">
              Upload a photo to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
