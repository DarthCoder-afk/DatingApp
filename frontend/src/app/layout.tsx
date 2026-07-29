import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "HeartLink — Meet people worth knowing",
  description: "Discover profiles, find mutual connections, and start conversations in a dating experience designed around mobile.",
  openGraph: {
    title: "HeartLink — Meet people worth knowing",
    description: "A warm, mobile-first way to discover profiles, match, and start conversations.",
    type: "website",
    images: [{ url: "/og.png", width: 1732, height: 909, alt: "HeartLink mobile dating experience" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartLink — Meet people worth knowing",
    description: "A warm, mobile-first way to discover profiles, match, and start conversations.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
