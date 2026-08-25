import type { Metadata } from "next";
import { Cormorant, Cinzel, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — Premium Gold & Silver Jewellery in ${siteConfig.city}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.tagline}. Explore BIS hallmarked gold and silver jewellery, live gold rates, and bridal collections at ${siteConfig.name}, ${siteConfig.city}.`,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.tagline,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: siteConfig.name,
    description: siteConfig.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      addressCountry: "IN",
    },
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: siteConfig.siteUrl,
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
