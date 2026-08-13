/**
 * Image utility functions for photo upload, HEIC conversion,
 * image loading, and dimension helpers.
 */

interface Heic2any {
  (opts: {
    blob: Blob;
    toType: string;
    quality: number;
  }): Promise<Blob | Blob[]>;
}

/**
 * Converts a HEIC/HEIF blob to a JPEG blob using heic2any.
 *
 * heic2any is loaded as a plain global script in layout.tsx.
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  const g = globalThis as typeof globalThis & {
    heic2any?: Heic2any;
  };

  const heic2any = g.heic2any;

  if (typeof heic2any !== "function") {
    throw new Error(
      "heic2any library failed to load. Check that /heic2any.min.js loaded."
    );
  }

  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });

  // heic2any can return either Blob or Blob[]
  if (Array.isArray(result)) {
    if (!result[0]) {
      throw new Error("HEIC conversion returned no image.");
    }

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
 * Load an image from a URL.
 *
 * Important:
 * Do NOT set crossOrigin for local blob URLs created with
 * URL.createObjectURL().
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject(
        new Error(
          `Failed to decode image from: ${src.slice(0, 60)}`
        )
      );
    };

    img.src = src;
  });
}

/**
 * Process an uploaded file.
 *
 * JPEG/PNG:
 *   File → Object URL → Preview
 *
 * HEIC/HEIF:
 *   File → HEIC conversion → JPEG Blob → Object URL → Preview
 */
export async function processUploadedFile(file: File): Promise<string> {
  // Normal browser-supported images don't need conversion.
  if (!isHeicFile(file)) {
    return URL.createObjectURL(file);
  }

  // HEIC / HEIF
  try {
    const jpegBlob = await convertHeicToJpeg(file);
    const convertedUrl = URL.createObjectURL(jpegBlob);

    // Make sure the converted JPEG actually decodes.
    try {
      await loadImage(convertedUrl);

      return convertedUrl;
    } catch (err) {
      console.warn(
        "Converted HEIC image failed to load, trying original:",
        err
      );

      URL.revokeObjectURL(convertedUrl);

      // Some browsers can decode HEIC natively.
      return URL.createObjectURL(file);
    }
  } catch (err) {
    console.warn(
      "HEIC conversion failed, attempting direct load:",
      err
    );

    // Fall back to the original file.
    return URL.createObjectURL(file);
  }
}

/**
 * Compute cover-fit dimensions for a photo within a clip region.
 *
 * Returns { x, y, width, height } such that the photo completely
 * covers the clip region while preserving its aspect ratio.
 */
export function computeCoverFit(
  photoWidth: number,
  photoHeight: number,
  clipWidth: number,
  clipHeight: number
): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const photoAspect = photoWidth / photoHeight;
  const clipAspect = clipWidth / clipHeight;

  let drawWidth: number;
  let drawHeight: number;

  if (photoAspect > clipAspect) {
    // Photo is wider than the clip region.
    drawHeight = clipHeight;
    drawWidth = clipHeight * photoAspect;
  } else {
    // Photo is taller than the clip region.
    drawWidth = clipWidth;
    drawHeight = clipWidth / photoAspect;
  }

  const x = (clipWidth - drawWidth) / 2;
  const y = (clipHeight - drawHeight) / 2;

  return {
    x,
    y,
    width: drawWidth,
    height: drawHeight,
  };
}

/**
 * Accepted file types for upload input.
 */
export const ACCEPTED_FILE_TYPES =
  "image/jpeg,image/jpg,image/png,image/heic,image/heif,.heic,.heif";