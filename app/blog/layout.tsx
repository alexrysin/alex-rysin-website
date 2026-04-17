import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "בלוג | אלכס ריסין — תכנון פיננסי ועצמאות כלכלית",
  description:
    "מאמרים מעשיים על תכנון פיננסי, השקעות, נדל״ן ועצמאות כלכלית — בעברית פשוטה, בלי עגה מקצועית.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
