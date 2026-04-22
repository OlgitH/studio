import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const univers = localFont({
  src: [
    {
      path: "./fonts/univers/Linotype - UniversLTStd-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/univers/Linotype - UniversLTStd-LightObl.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/univers/Linotype - UniversLTStd.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/univers/Linotype - UniversLTStd-Obl.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/univers/Linotype - UniversLTStd-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/univers/Linotype - UniversLTStd-BoldObl.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/univers/Linotype - UniversLTStd-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/univers/Linotype - UniversLTStd-BlackObl.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-univers",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Greencrown",
  description: "Creative and experimental studio in Bath, Somerset",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${univers.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
