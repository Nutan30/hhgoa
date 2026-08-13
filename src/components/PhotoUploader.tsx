"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { Camera, Upload, ImagePlus, X } from "lucide-react";
import { ACCEPTED_FILE_TYPES } from "@/lib/imageUtils";

interface PhotoUploaderProps {
  hasPhoto: boolean;
  onFileSelected: (file: File) => void;
}

export default function PhotoUploader({ hasPhoto, onFileSelected }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }

    return () => {
      cameraStream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraStream]);

  const closeCamera = useCallback(() => {
    setCameraStream((stream) => {
      stream?.getTracks().forEach((track) => track.stop());
      return null;
    });
  }, []);

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setCameraStream(stream);
    } catch {
      cameraInputRef.current?.click();
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      onFileSelected(new File([blob], "camera-photo.jpg", { type: "image/jpeg" }));
      closeCamera();
    }, "image/jpeg", 0.92);
  }, [closeCamera, onFileSelected]);

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
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleChange}
        className="hidden"
        id="camera-photo-input"
      />

      {!hasPhoto ? (
        <div className="flex flex-col gap-2">
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
          <button
            id="capture-photo-btn"
            onClick={openCamera}
            className="hh-btn hh-btn-secondary w-full py-3"
          >
            <Camera size={15} />
            Capture Photo
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            id="change-photo-btn"
            onClick={() => inputRef.current?.click()}
            className="hh-btn hh-btn-secondary flex-1 py-3"
          >
          <ImagePlus size={15} />
          Change Photo
          </button>
          <button
            id="capture-photo-btn"
            onClick={openCamera}
            className="hh-btn hh-btn-secondary flex-1 py-3"
          >
            <Camera size={15} />
            Capture Photo
          </button>
        </div>
      )}

      {cameraStream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md bg-[#075C35] border-2 border-[#FEE101] p-3 shadow-[5px_5px_0px_#000]">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-victor text-xs font-bold uppercase tracking-wider text-[#FEE101]">Capture Photo</span>
              <button onClick={closeCamera} className="text-[#FEE101]" aria-label="Close camera">
                <X size={20} />
              </button>
            </div>
            <video ref={videoRef} autoPlay playsInline className="w-full bg-black" />
            <button onClick={capturePhoto} className="hh-btn hh-btn-primary mt-3 w-full py-3">
              <Camera size={15} />
              Take Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
