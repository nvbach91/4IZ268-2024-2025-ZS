import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Obchůdek pana Lišáka",
  description: "Obchůdek pana Lišáka, obsahující sortiment pro každého.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="main-wrapper">
          <Suspense>{children}</Suspense>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
