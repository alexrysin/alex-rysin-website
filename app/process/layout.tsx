import type { Metadata } from "next";
import { faqPageSchema, jsonLdScript } from "@/lib/schema";
import { processFAQs } from "@/content/process-faqs";

export const metadata: Metadata = {
  title: "איך זה עובד | אלכס ריסין - תכנון פיננסי",
  description:
    "תהליך תכנון פיננסי שמייצר בהירות וכיוון ברור - משלב ההבנה, דרך בניית אסטרטגיה, ועד ליציאה לדרך עם ודאות וכלים.",
  openGraph: {
    title: "איך זה עובד | אלכס ריסין",
    description:
      "תהליך תכנון פיננסי קצר וממוקד שמייצר בהירות וכיוון ברור.",
    type: "website",
  },
};

export default function ProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = faqPageSchema(
    processFAQs.map((f) => ({ question: f.q, answer: f.a })),
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
      />
      {children}
    </>
  );
}
