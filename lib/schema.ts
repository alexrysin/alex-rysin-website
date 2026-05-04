// JSON-LD schema helpers for SEO. Inject via <script type="application/ld+json">.
// Reference: https://schema.org/Person, /ProfessionalService, /BlogPosting, /FAQPage

const SITE_URL = "https://alexrysin.co.il";

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "אלכס ריסין",
  alternateName: "Alex Rysin",
  url: SITE_URL,
  image: `${SITE_URL}/assets/why-me.jpg`,
  jobTitle: "מתכנן פיננסי",
  description:
    "מתכנן פיננסי ומלווה לעצמאות כלכלית. בונה עם לקוחות מערכת קבלת החלטות פיננסית - לא נותן תשובות מוכנות, אלא מלמד לחשוב נכון על הכסף.",
  email: "alex@alexrysin.co.il",
  telephone: "+972544580159",
  knowsAbout: [
    "תכנון פיננסי",
    "השקעות",
    "נדל\"ן",
    "פנסיה",
    "מינוף",
    "ניהול הון",
  ],
  sameAs: [SITE_URL],
};

export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "אלכס ריסין - תכנון פיננסי",
  url: SITE_URL,
  image: `${SITE_URL}/assets/why-me.jpg`,
  description:
    "תכנון פיננסי אישי שמוביל לעצמאות כלכלית. תהליך קצר וממוקד שמייצר כיוון ברור.",
  priceRange: "$$",
  serviceType: "Financial Planning",
  areaServed: { "@type": "Country", name: "Israel" },
  provider: { "@type": "Person", name: "אלכס ריסין" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+972544580159",
    contactType: "customer service",
    email: "alex@alexrysin.co.il",
    availableLanguage: ["Hebrew", "English"],
  },
};

interface BlogPostingArgs {
  title: string;
  description: string;
  date: string;
  slug: string;
  image?: string;
}

export function blogPostingSchema({ title, description, date, slug, image }: BlogPostingArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    url: `${SITE_URL}/blog/${slug}`,
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/assets/why-me.jpg`,
    author: { "@type": "Person", name: "אלכס ריסין", url: SITE_URL },
    publisher: { "@type": "Person", name: "אלכס ריסין", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    inLanguage: "he-IL",
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

export function jsonLdScript(data: object): string {
  return JSON.stringify(data);
}
