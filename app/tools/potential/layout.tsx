import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "המספר שלי | חישוב פוטנציאל כלכלי | אלכס ריסין",
  description:
    "תוך 5 דקות תגלה את הפוטנציאל הכלכלי האמיתי שלך - שווי נקי והכנסה חודשית שלא תלויה בעבודה, בעוד כמה שנים.",
};

export default function PotentialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
