import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COMS3011A Lab 1 Todo",
  description: "A local-first todo application for COMS3011A Lab 1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
