import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אודות | אלכס ריסין - תכנון פיננסי ועצמאות כלכלית",
  description:
    "הכירו את אלכס ריסין - יועץ פיננסי בלתי תלוי המתמחה בתכנון פיננסי אישי ובניית עצמאות כלכלית.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
