import type { Metadata } from "next";
import "./globals.scss";
import Footer from "./components/Footer/Footer";

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
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
