import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mowtrix High End Designs | Luxury Landscape Design-Build in Morris County, NJ",
  description:
    "Mowtrix High End Designs designs, builds, and maintains timeless outdoor spaces for distinguished New Jersey properties. Landscape design-build, hardscaping & masonry, and estate maintenance in Morris County.",
  keywords: [
    "luxury landscaping NJ",
    "Morris County landscape design",
    "estate landscaping New Jersey",
    "hardscaping Morris County",
    "landscape design-build NJ",
  ],
  openGraph: {
    title: "Mowtrix High End Designs",
    description:
      "Timeless landscape design-build, masonry, and estate care for Morris County, New Jersey.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
