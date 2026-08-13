import type { Metadata } from "next";
import { Inter, Victor_Mono, Imbue } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const victorMono = Victor_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-victor-mono", display: "swap" });
const imbue = Imbue({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-imbue", display: "swap" });

export const metadata: Metadata = {
  title: "HH Goa 2026 — Frame in Goa",
  description: "Generate your HH Goa 2026 PFP frame or Builder ID badge. Upload your photo, customize, and download. #FrameInGoa",
  openGraph: {
    title: "HH Goa 2026 — Frame in Goa",
    description: "Frame your builder moment in Goa 🌴💻 Generate your custom HH Goa 2026 profile frame.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 — Frame in Goa",
    description: "Frame your builder moment in Goa 🌴💻 #FrameInGoa",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${victorMono.variable} ${imbue.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        {/* heic2any is a UMD/CommonJS bundle with embedded WASM/worker code.
            Loading it as a plain global script (window.heic2any) avoids the
            bundler interop issues that break HEIC conversion in production. */}
        <Script
          src="/heic2any.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
