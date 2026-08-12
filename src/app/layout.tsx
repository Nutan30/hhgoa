import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HH Goa 2026 — Frame in Goa",
  description:
    "Generate your HH Goa 2026 PFP frame or Builder ID badge. Upload your photo, customize, and download. #FrameInGoa",
  openGraph: {
    title: "HH Goa 2026 — Frame in Goa",
    description:
      "Frame your builder moment in Goa 🌴💻 Generate your custom HH Goa 2026 profile frame.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 — Frame in Goa",
    description:
      "Frame your builder moment in Goa 🌴💻 #FrameInGoa",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
