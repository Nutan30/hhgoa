# 🌴 HH Goa 2026 — Frame Generator

A tropical-themed poster builder for **Hacker House Goa 2026**. Upload a photo, pick a frame format, adjust your shot, and export your very own "hacker identity" poster — no login, no tracking, just vibes.

Built with **Next.js (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## ✨ Features

- **📸 Photo upload** — drag & drop or browse, with automatic **HEIC/HEIF** conversion (via `heic2any` / `heic-to`) so iPhone photos just work.
- **🖼️ Two frame formats:**
  - **PFP Frame** — a circular profile-picture frame (1080×1080).
  - **Builder ID** — a vertical ID-card style frame (1080×1620) with your name, stack, and a fun builder title.
- **🎛️ Photo editor** — drag to reposition and pinch/slider to zoom your photo inside the frame.
- **🪪 Builder details** — add your name, tech stack, and pick from a curated list of builder titles (Code Surfer, AI Alchemist, Bug Hunter, …).
- **⬇️ Export & share** — download a high-res PNG, share via the native Web Share API, or share straight to **X (Twitter)** with a pre-filled post.
- **⚡ Fast first upload** — the HEIC decoder and frame overlays are preloaded in the background so the first conversion is quick.
- **🎨 Tropical UI** — palm trees, sun, waves, surfboards, and a bold yellow/pink/green palette.

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the source files.

### Other scripts

```bash
npm run build   # Create a production build
npm run start   # Start the production server
npm run lint    # Run ESLint
```

## 🗂️ Project Structure

```
src/
├── app/
│   └── page.tsx              # Main page — wires everything together
├── components/
│   ├── Header.tsx            # Page header
│   ├── FormatSelector.tsx    # PFP Frame / Builder ID tabs
│   ├── PhotoUploader.tsx     # Upload / change photo
│   ├── PhotoEditor.tsx       # Zoom & reposition controls
│   ├── BuilderForm.tsx       # Name / stack / title inputs (Builder ID)
│   ├── PreviewCanvas.tsx     # Live canvas preview
│   └── ExportActions.tsx     # Download PNG, Share, Share to X
└── lib/
    ├── types.ts              # Types + frame geometry constants
    ├── imageUtils.ts         # HEIC conversion & image loading
    └── canvas.ts             # Overlay preloading & PNG export
```

## 🧱 Tech Stack

- [Next.js 16](https://nextjs.org) — App Router
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) — icons
- [heic2any](https://github.com/catdad-experiments/heic2any) / [heic-to](https://www.npmjs.com/package/heic-to) — HEIC conversion

## ☁️ Deploy on Vercel

The easiest way to deploy this Next.js app is with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Made with 💛 in Goa. 🌴 Building. Hacking. Beaching.