import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/StructuredData";
import { Analytics } from "@/components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MentionBrevet.com - Analysez les mentions du brevet par prénom",
  description:
    "Découvrez les statistiques officielles du brevet des collèges 2025 par prénom. Visualisez les taux de mentions (TB, B, AB) et explorez les corrélations entre prénoms et réussite scolaire. Plus de 26 000 prénoms analysés.",
  keywords: [
    "brevet des collèges",
    "mention brevet",
    "statistiques brevet",
    "prénoms brevet",
    "résultats brevet 2025",
    "mention très bien",
    "mention bien",
    "mention assez bien",
    "éducation nationale",
    "collège",
    "DNB",
    "diplôme national du brevet",
    "réussite scolaire",
    "statistiques éducation",
    "données brevet",
    "analyse prénoms",
    "mentions par prénom",
  ],
  authors: [{ name: "MentionBrevet.com" }],
  creator: "MentionBrevet.com",
  publisher: "MentionBrevet.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mentionbrevet.com"
  ),
  alternates: {
    canonical: "https://mentionbrevet.com",
  },
  openGraph: {
    title: "MentionBrevet.com - Statistiques du brevet par prénom",
    description:
      "Explorez les données officielles du brevet des collèges 2025. Découvrez les taux de mentions par prénom et analysez les corrélations entre prénoms et réussite scolaire.",
    url: "https://mentionbrevet.com",
    siteName: "MentionBrevet.com",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MentionBrevet.com - Analyse des mentions du brevet par prénom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mentionbrevet",
    creator: "@mentionbrevet",
    title: "MentionBrevet.com - Statistiques du brevet par prénom",
    description:
      "Découvrez les corrélations entre prénoms et mentions au brevet des collèges 2025. Plus de 26 000 prénoms analysés.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
  category: "education",
  classification: "Éducation, Statistiques, Brevet des collèges",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <StructuredData />
        <Analytics />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col bg-background">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
