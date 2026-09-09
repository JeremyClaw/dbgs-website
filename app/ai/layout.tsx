import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./fluent.css";

const fluentDisplay = Newsreader({
  variable: "--font-fluent-display",
  subsets: ["latin"],
  display: "swap",
});

const fluentBody = Inter({
  variable: "--font-fluent-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deejburke.co.za"),
  title: {
    absolute: "Fluent: One-to-one AI coaching with Deej Burke",
  },
  description:
    "Private, practical AI coaching for professionals. Work one-to-one with Deej Burke on your own work, using your own laptop.",
  alternates: {
    canonical: "/AI-coaching-by-deej",
  },
  openGraph: {
    title: "Fluent: One-to-one AI coaching",
    description:
      "Sixty minutes, your own work, your own laptop. Leave using AI with confidence.",
    url: "/AI-coaching-by-deej",
    siteName: "Fluent",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "/AI-coaching-by-deej/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Fluent, one-to-one AI coaching with Deej Burke",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluent: One-to-one AI coaching",
    description: "Private, practical AI coaching for professionals.",
    images: ["/AI-coaching-by-deej/opengraph-image"],
  },
};

export default function FluentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${fluentDisplay.variable} ${fluentBody.variable}`}>{children}</div>;
}
