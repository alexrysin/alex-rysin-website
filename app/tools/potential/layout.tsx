import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "המספר שלי | חישוב פוטנציאל כלכלי | אלכס ריסין",
  description:
    "תוך 5 דקות תגלה את הפוטנציאל הכלכלי האמיתי שלך - שווי נקי והכנסה חודשית שלא תלויה בעבודה, בעוד כמה שנים.",
  alternates: { canonical: "/tools/potential/" },
};

export default function PotentialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
