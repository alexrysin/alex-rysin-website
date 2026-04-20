import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "המלצות לקוחות | אלכס ריסין - תכנון פיננסי",
  description:
    "לקוחות מספרים על התהליך - מה השתנה, איך הגיעו לבהירות, ואיך זה עזר להם לקבל החלטות כלכליות טובות יותר.",
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
