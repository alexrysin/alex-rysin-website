import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MotionProvider from "@/components/MotionProvider";
import { personSchema, professionalServiceSchema, jsonLdScript } from "@/lib/schema";

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  variable: "--font-heebo",
  display: "swap",
});

const SITE_URL = "https://alexrysin.co.il";
const OG_IMAGE = `${SITE_URL}/assets/why-me.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "אלכס ריסין | תכנון פיננסי ועצמאות כלכלית",
  description:
    "תכנון פיננסי אישי שמוביל לעצמאות כלכלית. אלכס ריסין מלווה אתכם מהבהירות ועד לביצוע בפועל.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "אלכס ריסין | תכנון פיננסי ועצמאות כלכלית",
    description:
      "תכנון פיננסי אישי שמוביל לעצמאות כלכלית. אלכס ריסין מלווה אתכם מהבהירות ועד לביצוע בפועל.",
    url: SITE_URL,
    siteName: "אלכס ריסין - תכנון פיננסי",
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1024,
        height: 683,
        alt: "אלכס ריסין - מתכנן פיננסי",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "אלכס ריסין | תכנון פיננסי ועצמאות כלכלית",
    description:
      "תכנון פיננסי אישי שמוביל לעצמאות כלכלית.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <head>
        {/* Preload hero image (WebP) used above the fold on the home page */}
        <link
          rel="preload"
          as="image"
          href="/assets/squeeze.webp"
          type="image/webp"
          fetchPriority="high"
        />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(professionalServiceSchema) }}
        />
      </head>
      <body className="font-heebo antialiased">
        {/* Skip to main content - נגישות */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:bg-[#1C3879] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
        >
          דלג לתוכן הראשי
        </a>
        <MotionProvider>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  );
}
