import type { Metadata } from "next";
import localFont from "next/font/local";
import Analytics from "./components/Analytics";
import BurgerMenu from "./components/BurgerMenu";
import CookieConsent from "./components/CookieConsent";
import ConditionalFooter from "./components/ConditionalFooter";
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
  title: "Greencrown Studio",
  description: "Creative website development in Bath, Somerset",
};

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-XXXXXXXXXX";

const hasValidGaId = GA_MEASUREMENT_ID !== "G-XXXXXXXXXX";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${univers.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <BurgerMenu />
        {children}
        <ConditionalFooter />
        <CookieConsent />
      </body>
      {hasValidGaId ? <Analytics gaId={GA_MEASUREMENT_ID} /> : null}
    </html>
  );
}
