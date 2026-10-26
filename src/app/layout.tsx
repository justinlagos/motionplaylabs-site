import type { Metadata, Viewport } from "next";
import "@fontsource-variable/mona-sans/standard.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "MotionPlay Labs", template: "%s | MotionPlay Labs" },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    title: "MotionPlay Labs",
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.ukCompany.legalName,
  alternateName: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  identifier: [{ "@type": "PropertyValue", propertyID: "Companies House", value: site.ukCompany.number }],
  areaServed: ["GB", "NG"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" data-tone="light">
      <body>
        <SmoothScroll />
        <Header />
        <main id="content" tabIndex={-1} data-tone="light">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
