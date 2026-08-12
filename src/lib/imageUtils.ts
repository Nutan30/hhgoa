/**
 * Image utility functions for photo upload, HEIC conversion, and dimension helpers.
 */

/**
 * Converts a HEIC/HEIF blob to a JPEG blob using heic2any.
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  // Dynamic import to avoid SSR issues
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });
  // heic2any can return Blob or Blob[]
  if (Array.isArray(result)) {
    return result[0];
  }
  return result;
}

/**
 * Check if a file is HEIC/HEIF format.
 */
export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

/**
 * Process an uploaded file: converts HEIC if needed, returns an object URL.
 */
export async function processUploadedFile(file: File): Promise<string> {
  if (isHeicFile(file)) {
    try {
      const jpegBlob = await convertHeicToJpeg(file);
      return URL.createObjectURL(jpegBlob);
    } catch (err) {
      console.warn("HEIC conversion failed, attempting direct load:", err);
      // Some browsers can handle HEIC natively
      return URL.createObjectURL(file);
    }
  }
  return URL.createObjectURL(file);
}

/**
 * Load an Image element from a URL and return it when loaded.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Compute cover-fit dimensions for a photo within a clip region.
 * Returns {x, y, width, height} such that the photo covers the clip region.
 */
export function computeCoverFit(
  photoWidth: number,
  photoHeight: number,
  clipWidth: number,
  clipHeight: number
): { x: number; y: number; width: number; height: number } {
  const photoAspect = photoWidth / photoHeight;
  const clipAspect = clipWidth / clipHeight;

  let drawWidth: number;
  let drawHeight: number;

  if (photoAspect > clipAspect) {
    // Photo is wider: fit by height
    drawHeight = clipHeight;
    drawWidth = clipHeight * photoAspect;
  } else {
    // Photo is taller: fit by width
    drawWidth = clipWidth;
    drawHeight = clipWidth / photoAspect;
  }

  const x = (clipWidth - drawWidth) / 2;
  const y = (clipHeight - drawHeight) / 2;

  return { x, y, width: drawWidth, height: drawHeight };
}

/**
 * Accepted file types for upload input.
 */
export const ACCEPTED_FILE_TYPES =
  "image/jpeg,image/jpg,image/png,image/heic,image/heif,.heic,.heif";
