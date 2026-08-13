/**
 * Image utility functions for photo upload, HEIC conversion, and dimension helpers.
 */

const HEIF_BRANDS = new Set([
  "mif1",
  "msf1",
  "heic",
  "heix",
  "hevc",
  "hevx",
  "avif",
  "avis",
]);

/**
 * Check ISO-BMFF `ftyp` bytes for HEIF/HEIC brands, with metadata fallback.
 */
export async function isHeicFile(file: File): Promise<boolean> {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const metadataIndicatesHeic =
    type === "image/heic" ||
    type === "image/heif" ||
    type === "image/avif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    name.endsWith(".avif");

  const header = new Uint8Array(await file.slice(0, 64).arrayBuffer());

  // ftyp is normally the first box, but some files have a leading "wide" box.
  const ftypStarts = [0, 8];
  for (const start of ftypStarts) {
    if (
      start + 12 <= header.length &&
      String.fromCharCode(...header.slice(start + 4, start + 8)) === "ftyp"
    ) {
      for (let offset = start + 8; offset + 4 <= header.length; offset += 4) {
        if (HEIF_BRANDS.has(String.fromCharCode(...header.slice(offset, offset + 4)))) {
          return true;
        }
      }
      break;
    }
  }

  return metadataIndicatesHeic;
}

/**
 * Convert a HEIC/HEIF file to a JPEG blob using the browser's native image
 * decoder (createImageBitmap). Handles AV1-coded HEIF/AVIF in Chromium and
 * HEIC in Safari.
 */
async function convertViaNativeDecoder(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable.");
    ctx.drawImage(bitmap, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );
    if (!blob) throw new Error("Canvas toBlob failed.");
    return blob;
  } finally {
    bitmap.close();
  }
}

/**
 * Warm up the HEIC decoder worker so the first real conversion is fast.
 * The worker and libheif module are initialized in the background during
 * page load instead of on the first photo upload.
 */
export async function preloadHeicDecoder(): Promise<void> {
  try {
    const { heicTo } = await import("heic-to");
    // Trigger worker creation + libheif init with a dummy blob.
    // This call is expected to fail (invalid data), but it warms the worker.
    await heicTo({
      blob: new Blob([new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0])], { type: "image/heic" }),
      type: "image/jpeg",
      quality: 0.92,
    });
  } catch {
    // Expected — dummy blob is not a valid HEIC. Worker is now warm.
  }
}

/**
 * Converts a HEIC/HEIF blob to a JPEG blob. Tries the libheif-based decoder
 * first (handles HEVC-coded HEIC/HEIF), then falls back to the browser's
 * native decoder (handles AV1-coded HEIF/AVIF and HEIC in Safari).
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  // 1) libheif-based decoder (heic-to) — handles HEVC-coded HEIC/HEIF
  try {
    const { heicTo } = await import("heic-to");
    const jpegBlob = await heicTo({
      blob: file,
      type: "image/jpeg",
      quality: 0.92,
    });
    if (jpegBlob.size > 0 && jpegBlob.type === "image/jpeg") {
      return jpegBlob;
    }
  } catch {
    // fall through to native decoder
  }

  // 2) Browser-native decoder — handles AV1-coded HEIF/AVIF (Chromium)
  //    and HEIC (Safari)
  try {
    const jpegBlob = await convertViaNativeDecoder(file);
    if (jpegBlob.size > 0 && jpegBlob.type === "image/jpeg") {
      return jpegBlob;
    }
  } catch {
    // fall through
  }

  throw new Error("HEIC/HEIF decoder did not produce a valid JPEG image.");
}

/**
 * Process an uploaded file: converts HEIC if needed, returns an object URL.
 */
export async function processUploadedFile(file: File): Promise<string> {
  if (await isHeicFile(file)) {
    let jpegBlob: Blob;
    try {
      jpegBlob = await convertHeicToJpeg(file);
    } catch (error) {
      throw new Error("Unable to convert this HEIC/HEIF photo to JPEG.", { cause: error });
    }

    if (jpegBlob.size === 0 || jpegBlob.type !== "image/jpeg") {
      throw new Error("HEIC/HEIF conversion did not produce a valid JPEG image.");
    }

    return URL.createObjectURL(jpegBlob);
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
  "image/jpeg,image/jpg,image/png,image/heic,image/heif,image/avif,.heic,.heif,.avif";