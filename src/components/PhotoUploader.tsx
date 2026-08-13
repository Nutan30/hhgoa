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
          className="hh-upload-zone w-full flex flex-col items-center justify-center gap-3 p-6 cursor-pointer group"
        >
          <div className="w-12 h-12 border-2 border-[#FEE101]/50 bg-[#FEE101]/10 flex items-center justify-center group-hover:bg-[#FEE101]/20 transition-colors">
            <Upload size={22} className="text-[#FEE101]" />
          </div>
          <div className="text-center">
            <p className="font-victor font-bold text-sm tracking-wide uppercase text-[#FEE101]">Upload Your Photo</p>
            <p className="font-victor text-[11px] mt-1 text-[#FFFBE8]/40">
              JPG, PNG, or HEIC · Drag &amp; drop or tap to browse
            </p>
          </div>
        </button>
      ) : (
        <button
          id="change-photo-btn"
          onClick={() => inputRef.current?.click()}
          className="hh-btn hh-btn-secondary w-full py-3"
        >
          <ImagePlus size={15} />
          Change Photo
        </button>
      )}
    </div>
  );
}
