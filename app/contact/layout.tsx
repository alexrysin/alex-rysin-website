import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "צור קשר | אלכס ריסין - תכנון פיננסי ועצמאות כלכלית",
  description:
    "קבעו שיחת היכרות חינם עם אלכס ריסין. ללא התחייבות - שיחה שיכולה לשנות הרבה.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
