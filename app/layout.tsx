import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const ogImage = "/api/og?title=ShivNarayan%20Sah&subtitle=Full-Stack%20Developer%20building%20thoughtful%20web%20products";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: "ShivNarayan Sah — Full-Stack Developer",
    template: "%s — ShivNarayan Sah",
  },
  description:
    "ShivNarayan Sah is a full-stack developer in Kathmandu building production-ready web applications with React, Next.js, Node.js, and MongoDB.",
  applicationName: "ShivNarayan Sah — Portfolio",
  authors: [{ name: "ShivNarayan Sah", url: absoluteUrl() }],
  creator: "ShivNarayan Sah",
  publisher: "ShivNarayan Sah",
  keywords: [
    "ShivNarayan Sah",
    "Full-Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js",
    "MongoDB",
    "Kathmandu",
    "Nepal",
    "Portfolio",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl(),
    siteName: "ShivNarayan Sah",
    title: "ShivNarayan Sah — Full-Stack Developer",
    description:
      "Full-stack developer building responsive, scalable, production-ready web applications with React, Next.js, Node.js, and MongoDB.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "ShivNarayan Sah — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShivNarayan Sah — Full-Stack Developer",
    description:
      "Full-stack developer building responsive, scalable, production-ready web applications.",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            theme="system"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: "14px",
                border: "1px solid var(--line)",
                background: "var(--surface)",
                color: "var(--ink)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
