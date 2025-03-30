import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Dataset",
  description: "F1 Dataset",
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
