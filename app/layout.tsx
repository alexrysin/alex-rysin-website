import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
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
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-heebo antialiased">
        {/* Skip to main content - נגישות */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:bg-[#1C3879] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
        >
          דלג לתוכן הראשי
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
