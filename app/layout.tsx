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
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
