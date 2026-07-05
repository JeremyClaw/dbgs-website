import type { Metadata } from "next";
import { Anton, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-script",
  weight: ["500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DB Growth Solutions: Paid Media & Creative Systems for DTC Brands",
  description:
    "The paid media system for DTC brands ready to scale. Diagnose first, build second, scale what's proven.",
  openGraph: {
    title: "DB Growth Solutions",
    description: "The paid media system for DTC brands ready to scale.",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${manrope.variable} ${playfair.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
