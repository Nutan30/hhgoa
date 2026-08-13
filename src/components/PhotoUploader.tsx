"use client";

import React, { useRef, useCallback } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { ACCEPTED_FILE_TYPES } from "@/lib/imageUtils";

interface PhotoUploaderProps {
  hasPhoto: boolean;
  onFileSelected: (file: File) => void;
}

export default function PhotoUploader({ hasPhoto, onFileSelected }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelected(file);
        e.target.value = "";
      }
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        onChange={handleChange}
        className="hidden"
        id="photo-upload-input"
      />

      {!hasPhoto ? (
        <button
          id="upload-photo-btn"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-[#145A3D] bg-[#FFF7E6] hover:bg-[#FFD21A]/20 transition-all duration-200 cursor-pointer group"
        >
          <div className="w-11 h-11 border-2 border-[#145A3D] bg-[#145A3D]/10 flex items-center justify-center group-hover:bg-[#FFD21A]/40 transition-colors">
            <Upload size={22} className="text-[#145A3D]" />
          </div>
          <div className="text-center">
            <p className="text-[#0E3B2E] font-bold text-base tracking-wide">Upload Your Photo</p>
            <p className="text-[#0E3B2E]/50 text-xs mt-1 font-mono">
              JPG, PNG, or HEIC · Drag & drop or tap to browse
            </p>
          </div>
        </button>
      ) : (
        <button
          id="change-photo-btn"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-[#0E3B2E] bg-[#FFF7E6] hover:bg-[#FFD21A]/30 text-[#0E3B2E] transition-all text-sm font-bold tracking-wide cursor-pointer shadow-[2px_2px_0px_#0E3B2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          <ImagePlus size={16} />
          Change Photo
        </button>
      )}
    </div>
  );
}
