import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegistrar from "@/components/pwa-registrar";

export const metadata: Metadata = {
  title: "Kimba",
  description: "Personal dashboard and habit tracker",
  applicationName: "Kimba",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kimba",
  },
  icons: {
    icon: [
      { url: "/pwa/android/launchericon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/android/launchericon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/pwa/ios/180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FEF3F2",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/pwa/ios/180.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kimba" />
      </head>
      <body className="min-h-dvh bg-app text-primary antialiased">
        <PwaRegistrar />
        {children}
      </body>
    </html>
  );
}
