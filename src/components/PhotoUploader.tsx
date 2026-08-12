"use client";

import React, { useRef, useCallback } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { ACCEPTED_FILE_TYPES } from "@/lib/imageUtils";

interface PhotoUploaderProps {
  hasPhoto: boolean;
  onFileSelected: (file: File) => void;
}

export default function PhotoUploader({
  hasPhoto,
  onFileSelected,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelected(file);
        // Reset input so same file can be re-selected
        e.target.value = "";
      }
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelected(file);
      }
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
          className="w-full flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-[#FFE853]/40 bg-[#FFE853]/5 hover:bg-[#FFE853]/10 hover:border-[#FFE853]/60 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-[#FFE853]/10 flex items-center justify-center group-hover:bg-[#FFE853]/20 transition-colors">
            <Upload
              size={28}
              className="text-[#FFE853] group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-base">Upload Your Photo</p>
            <p className="text-white/50 text-xs mt-1">
              JPG, PNG, or HEIC • Drag & drop or tap to browse
            </p>
          </div>
        </button>
      ) : (
        <button
          id="change-photo-btn"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-medium cursor-pointer"
        >
          <ImagePlus size={16} />
          Change Photo
        </button>
      )}
    </div>
  );
}
