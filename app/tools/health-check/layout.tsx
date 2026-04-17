import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מבחן בריאות כלכלית | אלכס ריסין",
  description:
    "15 שאלות קצרות על הבסיס הכלכלי שלכם — קרן חירום, חובות, חיסכון, תכנון ופיקוח. תוצאה מיידית עם ציון לכל קטגוריה והמלצות אישיות.",
};

export default function HealthCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
