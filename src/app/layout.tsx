import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Bebas_Neue, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-ibm-plex-mono", display: "swap" });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas-neue", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

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
    <html lang="en" className={`h-full antialiased ${inter.variable} ${ibmPlexMono.variable} ${bebasNeue.variable} ${anton.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
