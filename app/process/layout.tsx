import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "איך זה עובד | אלכס ריסין - תכנון פיננסי",
  description:
    "תהליך תכנון פיננסי שמייצר בהירות וכיוון ברור - משלב ההבנה, דרך בניית אסטרטגיה, ועד ליציאה לדרך עם ודאות וכלים.",
};

export default function ProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
