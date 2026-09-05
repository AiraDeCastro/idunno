import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "I Dunno",
  description: "Spin the wheel. Try somewhere new.",
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
