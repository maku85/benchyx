import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const basePath = process.env.BASE_PATH ?? "";
const siteUrl = `https://maku85.github.io${basePath}`;

const title =
  "Benchyx — Free Online Developer Tools (JSON, JWT, Regex, Diff, Base64)";
const description =
  "Benchyx is a free, open-source workspace of developer utilities: JSON formatter/validator, JWT decoder, Base64 & URL encoder, regex tester, Unix timestamp converter, and text diff — all in one fast, minimalist tool.";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: title,
    template: "%s | Benchyx",
  },
  description,
  keywords: [
    "json formatter",
    "json validator",
    "jwt decoder",
    "base64 encoder",
    "url encoder decoder",
    "regex tester",
    "unix timestamp converter",
    "text diff tool",
    "online developer tools",
  ],
  authors: [{ name: "maku85", url: "https://github.com/maku85" }],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Benchyx",
    images: [{ url: "/banner.webp", width: 1424, height: 752, alt: "Benchyx" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "vwU9Da2JCHmgOzV3Xg5dBbSxMw_-zo1ctKIodzLOFj0",
    other: {
      "msvalidate.01": "F34D7F66818840D88DF443A4D8CF0E91",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Benchyx",
  url: siteUrl,
  description,
  image: `${siteUrl}/banner.webp`,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "JSON formatter and validator",
    "JWT decoder",
    "Base64 and URL encoder/decoder",
    "Regex tester",
    "Unix timestamp converter",
    "Text diff",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "dark",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="h-full overflow-hidden bg-background text-foreground">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, no user input
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
