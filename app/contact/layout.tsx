import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "צור קשר | אלכס ריסין — תכנון פיננסי ועצמאות כלכלית",
  description:
    "קבעו שיחת היכרות חינם עם אלכס ריסין. ללא התחייבות — רק 30 דקות שיכולות לשנות הרבה.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
