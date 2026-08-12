export type FormatType = "formatA" | "formatB";

export interface TransformState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface BuilderDetails {
  name: string;
  stack: string;
  title: string;
}

// Frame geometry for each format (in native overlay resolution)
export interface FrameGeometry {
  // Overlay image native dimensions
  overlayWidth: number;
  overlayHeight: number;
  // Output dimensions
  outputWidth: number;
  outputHeight: number;
  // Photo cutout region (center + radius for circle, or rect bounds for rounded rect)
  clipType: "circle" | "roundedRect";
  // Circle clip (Format A)
  circleCenterX?: number;
  circleCenterY?: number;
  circleRadius?: number;
  // Rounded rect clip (Format B)
  rectX?: number;
  rectY?: number;
  rectWidth?: number;
  rectHeight?: number;
  rectRadius?: number;
}

// Measured from reference image analysis:
// Format A: 2508×2508, transparent circle center ~(1254, 1211), radius ~852
// Format B: 2048×3072, transparent rounded rect region 2 at Y=[738,1956], X=[365,1672]

export const FORMAT_A_GEOMETRY: FrameGeometry = {
  overlayWidth: 2508,
  overlayHeight: 2508,
  outputWidth: 1080,
  outputHeight: 1080,
  clipType: "circle",
  circleCenterX: 1254,
  circleCenterY: 1211,
  circleRadius: 850,
};

export const FORMAT_B_GEOMETRY: FrameGeometry = {
  overlayWidth: 2048,
  overlayHeight: 3072,
  outputWidth: 1080,
  outputHeight: 1620, // 2:3 ratio ≈ 1080×1620
  clipType: "roundedRect",
  rectX: 365,
  rectY: 553,
  rectWidth: 1307, // 1672 - 365
  rectHeight: 1403, // 1956 - 553
  rectRadius: 60,
};

export const BUILDER_TITLES = [
  "Code Surfer",
  "AI Alchemist",
  "Bug Hunter",
  "Pixel Pirate",
  "Data Wizard",
  "Cloud Nomad",
  "Prompt Pirate",
  "Stack Sensei",
  "Debug Ninja",
  "Byte Bender",
  "Hash Hacker",
  "Web Weaver",
  "Rust Ranger",
  "Git Guardian",
  "Kernel Keeper",
] as const;
