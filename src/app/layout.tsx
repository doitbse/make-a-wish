import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acme Analytics: Make a wish",
  description:
    "Sample product surface used to test the in-app feedback widget. Submit a wish, bug, or annotation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
        <Script
          src="/widget.js"
          data-app="acme-analytics"
          data-repo="doitbse/make-a-wish"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
