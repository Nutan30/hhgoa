/**
 * Image utility functions for photo upload, HEIC conversion, and dimension helpers.
 */

/**
 * Converts a HEIC/HEIF blob to a JPEG blob with the reference project's
 * browser-compatible HEIF decoder.
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  const { heicTo } = await import("heic-to");
  const jpegBlob = await heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.92,
  });

  if (jpegBlob.size === 0 || jpegBlob.type !== "image/jpeg") {
    throw new Error("HEIC decoder did not produce a valid JPEG image.");
  }

  return jpegBlob;
}

const HEIF_BRANDS = new Set(["mif1", "msf1", "heic", "heix", "hevc", "hevx"]);

/**
 * Check ISO-BMFF `ftyp` bytes for HEIF/HEIC brands, with metadata fallback.
 */
export async function isHeicFile(file: File): Promise<boolean> {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const metadataIndicatesHeic =
    type === "image/heic" ||
    type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif");

  const header = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  if (header.length >= 12 && String.fromCharCode(...header.slice(4, 8)) === "ftyp") {
    for (let offset = 8; offset + 4 <= header.length; offset += 4) {
      if (HEIF_BRANDS.has(String.fromCharCode(...header.slice(offset, offset + 4)))) {
        return true;
      }
    }
  }

  return metadataIndicatesHeic;
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
  "image/jpeg,image/jpg,image/png,image/heic,image/heif,.heic,.heif";
