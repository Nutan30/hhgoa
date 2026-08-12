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

  // Drag state refs (avoid re-renders during drag)
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(0);
  const transformRef = useRef(transform);
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  const geo = format === "formatA" ? FORMAT_A_GEOMETRY : FORMAT_B_GEOMETRY;

  // Compute display scale factor (canvas native → displayed size)
  const getDisplayScale = useCallback((): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 1;
    const displayWidth = canvas.getBoundingClientRect().width;
    return geo.overlayWidth / displayWidth;
  }, [geo.overlayWidth]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderFrame(canvas, format, userPhoto, transform, builderDetails);
  }, [format, userPhoto, transform, builderDetails]);

  // ---- Mouse drag ----
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
      onTransformChange({
        ...t,
        offsetX: t.offsetX + dx,
        offsetY: t.offsetY + dy,
      });
    },
    [getDisplayScale, onTransformChange]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ---- Touch drag + pinch ----
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!userPhoto) return;
      if (e.touches.length === 1) {
        isDragging.current = true;
        lastPointer.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        isDragging.current = false;
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastPinchDist.current = dist;
      }
    },
    [userPhoto]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const t = transformRef.current;
      if (e.touches.length === 1 && isDragging.current) {
        const scale = getDisplayScale();
        const dx = (e.touches[0].clientX - lastPointer.current.x) * scale;
        const dy = (e.touches[0].clientY - lastPointer.current.y) * scale;
        lastPointer.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        onTransformChange({
          ...t,
          offsetX: t.offsetX + dx,
          offsetY: t.offsetY + dy,
        });
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastPinchDist.current > 0) {
          const pinchScale = dist / lastPinchDist.current;
          const newScale = Math.max(0.5, Math.min(3, t.scale * pinchScale));
          onTransformChange({ ...t, scale: newScale });
        }
        lastPinchDist.current = dist;
      }
    },
    [getDisplayScale, onTransformChange]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    lastPinchDist.current = 0;
  }, []);

  // Aspect ratio for the container
  const aspectRatio = geo.overlayWidth / geo.overlayHeight;

  return (
    <div
      ref={containerRef}
      className="poster-card relative w-full overflow-hidden bg-[#145A3D]"
      style={{ aspectRatio: `${aspectRatio}` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        style={{ display: "block" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Overlay hint when no photo */}
      {!userPhoto && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white/30 text-sm font-medium">
            Upload a photo to get started
          </p>
        </div>
      )}
    </div>
  );
}
