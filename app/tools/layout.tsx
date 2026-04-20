import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "כלים | אלכס ריסין",
  description:
    "כלים חינמיים לתכנון פיננסי - מחשבון פוטנציאל כלכלי ומבחן בריאות כלכלית. בלי הרשמה, תוצאה מיידית.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
