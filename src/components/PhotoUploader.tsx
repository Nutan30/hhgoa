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
          className="poster-card w-full flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-[#145A3D] bg-[#FFF7E6] hover:bg-[#FFD21A]/30 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-[#FFD21A] border border-[#0E3B2E] flex items-center justify-center group-hover:bg-[#FF2D85] transition-colors">
            <Upload
              size={28}
              className="text-[#0E3B2E] group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="text-center">
            <p className="text-[#145A3D] font-black text-base">Upload Your Photo</p>
            <p className="text-[#0E3B2E]/60 text-xs mt-1">
              JPG, PNG, or HEIC • Drag & drop or tap to browse
            </p>
          </div>
        </button>
      ) : (
        <button
          id="change-photo-btn"
          onClick={() => inputRef.current?.click()}
          className="poster-card w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FFF7E6] hover:bg-[#FFD21A] text-[#145A3D] transition-all text-sm font-black cursor-pointer"
        >
          <ImagePlus size={16} />
          Change Photo
        </button>
      )}
    </div>
  );
}
