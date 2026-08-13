/**
 * Canvas composition engine for rendering Format A (PFP) and Format B (Builder ID).
 *
 * Architecture:
 *   1. Create offscreen canvas at native overlay resolution
 *   2. Clip to photo window geometry (circle or rounded rect)
 *   3. Draw user photo with transform (scale, offset) inside clip
 *   4. Reset clip, draw overlay artwork on top
 *   5. For Format B: render text fields (name, stack, title)
 *   6. If output resolution differs, scale down to final output
 */

import {
  type FormatType,
  type TransformState,
  type BuilderDetails,
  type FrameGeometry,
  FORMAT_A_GEOMETRY,
  FORMAT_B_GEOMETRY,
} from "@/lib/types";
import { computeCoverFit } from "@/lib/imageUtils";

// Preloaded overlay images cache
let overlayA: HTMLImageElement | null = null;
let overlayB: HTMLImageElement | null = null;

/**
 * Preload overlay images. Call once on app mount.
 */
export async function preloadOverlays(): Promise<void> {
  const loadImg = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const [a, b] = await Promise.all([
    loadImg("/assets/format_a.png"),
    loadImg("/assets/format_b.png"),
  ]);
  overlayA = a;
  overlayB = b;
}

export function getOverlay(format: FormatType): HTMLImageElement | null {
  return format === "formatA" ? overlayA : overlayB;
}

function getGeometry(format: FormatType): FrameGeometry {
  return format === "formatA" ? FORMAT_A_GEOMETRY : FORMAT_B_GEOMETRY;
}

/**
 * Draw a rounded rectangle path.
 */
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Core render function.
 * Renders onto the given canvas at native overlay resolution.
 */
export function renderFrame(
  canvas: HTMLCanvasElement,
  format: FormatType,
  userPhoto: HTMLImageElement | null,
  transform: TransformState,
  builderDetails?: BuilderDetails
): void {
  const geo = getGeometry(format);
  const overlay = getOverlay(format);
  if (!overlay) return;

  // Set canvas to native overlay resolution
  canvas.width = geo.overlayWidth;
  canvas.height = geo.overlayHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Step 1: Draw user photo clipped to the frame window
  if (userPhoto) {
    ctx.save();

    // Create clipping path
    if (geo.clipType === "circle" && geo.circleCenterX !== undefined) {
      // Use a clip radius slightly larger than the hole so the photo bleeds
      // under the frame border ring, hiding any anti-aliasing or light photo
      // edges that would otherwise show as a gap against the cream border.
      const clipRadius = geo.circleRadius! + 6;
      const clipSize = clipRadius * 2;

      ctx.beginPath();
      ctx.arc(
        geo.circleCenterX,
        geo.circleCenterY!,
        clipRadius,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();

      const fit = computeCoverFit(
        userPhoto.naturalWidth,
        userPhoto.naturalHeight,
        clipSize,
        clipSize
      );

      const cx = geo.circleCenterX;
      const cy = geo.circleCenterY!;
      const baseX = cx - clipRadius + fit.x;
      const baseY = cy - clipRadius + fit.y;

      ctx.translate(cx, cy);
      ctx.scale(transform.scale, transform.scale);
      ctx.translate(-cx, -cy);
      ctx.translate(transform.offsetX, transform.offsetY);

      ctx.drawImage(userPhoto, baseX, baseY, fit.width, fit.height);
    } else if (geo.clipType === "roundedRect" && geo.rectX !== undefined) {
      roundedRectPath(
        ctx,
        geo.rectX,
        geo.rectY!,
        geo.rectWidth!,
        geo.rectHeight!,
        geo.rectRadius!
      );
      ctx.clip();

      // Compute cover fit within the rect
      const fit = computeCoverFit(
        userPhoto.naturalWidth,
        userPhoto.naturalHeight,
        geo.rectWidth!,
        geo.rectHeight!
      );

      const baseX = geo.rectX + fit.x;
      const baseY = geo.rectY! + fit.y;

      // Apply transform
      const cx = geo.rectX + geo.rectWidth! / 2;
      const cy = geo.rectY! + geo.rectHeight! / 2;

      ctx.translate(cx, cy);
      ctx.scale(transform.scale, transform.scale);
      ctx.translate(-cx, -cy);
      ctx.translate(transform.offsetX, transform.offsetY);

      ctx.drawImage(userPhoto, baseX, baseY, fit.width, fit.height);
    }

    ctx.restore();
  }

  // Step 2: Draw overlay artwork on top
  ctx.drawImage(overlay, 0, 0, geo.overlayWidth, geo.overlayHeight);

  // Step 3: For Format B, render text fields
  if (format === "formatB" && builderDetails) {
    renderBuilderText(ctx, geo, builderDetails);
  }
}

/**
 * Dynamic text auto-scaling helper to ensure long values never overflow.
 */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  initialFontSize: number,
  fontFamily: string
): number {
  let fontSize = initialFontSize;
  const minFontSize = 24;

  while (fontSize > minFontSize) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    if (metrics.width <= maxWidth) {
      break;
    }
    fontSize -= 2;
  }

  return fontSize;
}

/**
 * Render text fields for Format B (Builder ID).
 *
 * Strict Two-Part Layout:
 *   [ICON]   NAME                     (Label top Y ≈ 2095..2140)
 *            SUYASH PATIL             (Value line Y = 2195)
 *            ─────────────────────    (Line Y = 2235)
 *
 *   [ICON]   YOUR STACK / ROLE        (Label top Y ≈ 2365..2410)
 *            Full Stack Developer     (Value line Y = 2465)
 *            ─────────────────────    (Line Y = 2505)
 *
 *   [ICON]   BUILDER TITLE            (Label top Y ≈ 2635..2680)
 *            ⚡ Bug Hunter            (Value pill Y = 2730)
 *            ─────────────────────    (Line Y = 2775)
 *
 * Label and Value occupy separate Y coordinates, ensuring ZERO vertical overlap.
 */
function renderBuilderText(
  ctx: CanvasRenderingContext2D,
  geo: FrameGeometry,
  details: BuilderDetails
): void {
  const leftX = 500;
  const maxWidth = 1300; // Safe area width from X=500 to X=1800
  const fontFamily = "'Comic Sans MS', 'Comic Sans', cursive";
  const fontSize = 100;
  const textColor = "#FFE9A8";

  // 1. Name — vertically aligned with the person icon
  if (details.name && details.name.trim() !== "") {
    ctx.save();
    const nameText = details.name.toUpperCase();
    const fittedFontSize = fitText(ctx, nameText, maxWidth, fontSize, fontFamily);

    ctx.font = `bold ${fittedFontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(nameText, leftX, 2150);
    ctx.restore();
  }

  // 2. Stack / Role — vertically aligned with the code icon
  if (details.stack && details.stack.trim() !== "") {
    ctx.save();
    const stackText = details.stack;
    const fittedFontSize = fitText(ctx, stackText, maxWidth, fontSize, fontFamily);

    ctx.font = `bold ${fittedFontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(stackText, leftX, 2420);
    ctx.restore();
  }

  // 3. Builder Title — vertically aligned with the star icon
  if (details.title && details.title.trim() !== "") {
    ctx.save();
    const titleText = details.title.startsWith("⚡")
      ? details.title
      : `⚡ ${details.title}`;
    const fittedFontSize = fitText(ctx, titleText, maxWidth - 50, fontSize, fontFamily);

    ctx.font = `bold ${fittedFontSize}px ${fontFamily}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const metrics = ctx.measureText(titleText);
    const pillWidth = Math.min(metrics.width + 44, maxWidth);
    const pillHeight = Math.max(48, fittedFontSize + 14);
    const pillX = leftX;
    const pillY = 2690;

    // Draw sunset pink tag pill background inside the value area
    ctx.fillStyle = "#FF3B81";
    roundedRectPath(
      ctx,
      pillX,
      pillY - pillHeight / 2,
      pillWidth,
      pillHeight,
      14
    );
    ctx.fill();

    // Draw pill text
    ctx.fillStyle = textColor;
    ctx.fillText(titleText, pillX + 22, pillY);
    ctx.restore();
  }
}

/**
 * Export the canvas as a PNG blob at the target output resolution.
 */
export async function exportCanvasPNG(
  format: FormatType,
  userPhoto: HTMLImageElement | null,
  transform: TransformState,
  builderDetails?: BuilderDetails
): Promise<Blob> {
  const geo = getGeometry(format);

  // Create offscreen canvas at native resolution
  const offscreen = document.createElement("canvas");
  renderFrame(offscreen, format, userPhoto, transform, builderDetails);

  // Scale down to output resolution
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = geo.outputWidth;
  outputCanvas.height = geo.outputHeight;
  const outCtx = outputCanvas.getContext("2d");
  if (!outCtx) throw new Error("Failed to create output canvas context");

  outCtx.drawImage(
    offscreen,
    0,
    0,
    geo.overlayWidth,
    geo.overlayHeight,
    0,
    0,
    geo.outputWidth,
    geo.outputHeight
  );

  return new Promise((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      "image/png",
      1.0
    );
  });
}
