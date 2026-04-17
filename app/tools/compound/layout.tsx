import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מחשבון ריבית דריבית | אלכס ריסין",
  description:
    "מחשבון ריבית דריבית חינמי — תכננו כמה הכסף שלכם יצמח לאורך השנים, או חשבו את התשואה השנתית שאתם צריכים כדי להגיע ליעד.",
};

export default function CompoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
