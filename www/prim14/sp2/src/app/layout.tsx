import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Obchůdek Petra Lišáka",
  description: "Obchůdek Petra Lišáka, obsahující sortiment pro každého.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body>
        <div className="main-wrapper">
          <Suspense>
            <Header />
            <main>{children}</main>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
