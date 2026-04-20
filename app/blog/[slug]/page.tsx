import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPostBySlug } from "@/content/posts";

// ============================================================================
// Blog post detail page - full essay with typographic treatment.
// Static params are generated at build time for all posts.
// ============================================================================

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "מאמר לא נמצא | אלכס ריסין" };
  return {
    title: `${post.title} | אלכס ריסין`,
    description: post.excerpt,
  };
}

const categoryAccents: Record<string, { from: string; to: string; text: string }> = {
  'נדל"ן':        { from: "#1A365D", to: "#2a4a7a", text: "#5AC8C8" },
  "השקעות":       { from: "#5AC8C8", to: "#4ab8b8", text: "#ffffff" },
  "תכנון פיננסי": { from: "#1A365D", to: "#3b5a88", text: "#D4AF37" },
  "מיינדסט":       { from: "#D4AF37", to: "#e6c350", text: "#1A365D" },
  "תפיסת עולם":   { from: "#1A365D", to: "#4a6fa5", text: "#D4AF37" },
  "קבלת החלטות":  { from: "#5AC8C8", to: "#1A365D", text: "#ffffff" },
};

const fallbackAccent = { from: "#1A365D", to: "#2a4a7a", text: "#5AC8C8" };

// Render the post body as paragraphs. Blank lines separate paragraphs.
// Lines starting with a decorator ("***", "---") are rendered as dividers.
function renderBody(body: string) {
  const paragraphs = body.split(/\n{2,}/);

  return paragraphs.map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Divider line (***, ---, ___)
    if (/^[\*\-_]{3,}$/.test(trimmed)) {
      return (
        <hr
          key={i}
          className="my-10 border-0 h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent"
        />
      );
    }

    // Render line breaks within a paragraph as <br/>
    const lines = para.split("\n");
    return (
      <p
        key={i}
        className="text-gray-700 text-[1.0625rem] md:text-lg leading-[1.95] mb-6"
      >
        {lines.map((line, li) => (
          <span key={li}>
            {line}
            {li < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

export default function BlogPostPage({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const accent = categoryAccents[post.category] ?? fallbackAccent;

  // Related posts - up to 3 from the same category, falling back to others.
  const related = [
    ...posts.filter(
      (p) => p.slug !== post.slug && p.category === post.category,
    ),
    ...posts.filter(
      (p) => p.slug !== post.slug && p.category !== post.category,
    ),
  ].slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero band - background image (if provided) tinted with brand gradient,
          otherwise a pure gradient panel. */}
      <section
        className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-28"
        style={
          post.image
            ? undefined
            : { background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }
        }
      >
        {post.image && (
          <>
            <Image
              src={post.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </>
        )}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-white/5 rounded-full blur-3xl translate-y-1/2"
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition-colors"
          >
            <span aria-hidden>→</span>
            <span>חזרה לבלוג</span>
          </Link>

          <div
            className="inline-block text-[11px] font-bold tracking-widest uppercase mb-4"
            style={{ color: accent.text }}
          >
            {post.category}
          </div>

          <h1 className="text-3xl md:text-[2.5rem] font-bold text-white leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span>קריאה של {post.readMinutes} דקות</span>
            <span className="opacity-60">·</span>
            <span>מאת אלכס ריסין</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="relative -mt-10 md:-mt-14 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-[0_30px_80px_-30px_rgba(26,54,93,0.35)] border border-gray-100 px-6 md:px-12 py-10 md:py-14">
            <p className="text-[#1C3879] text-lg md:text-xl leading-relaxed font-semibold mb-8 pb-8 border-b border-gray-100">
              {post.excerpt}
            </p>

            <div className="prose-rtl">{renderBody(post.body)}</div>

            {/* Closing CTA */}
            <div className="mt-12 pt-10 border-t border-gray-100">
              <div className="bg-gradient-to-br from-[#1A365D] to-[#2a4a7a] rounded-2xl p-8 md:p-10 text-center text-white relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute top-0 right-0 w-40 h-40 bg-[#5AC8C8]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
                />
                <div className="relative">
                  <h2 className="text-xl md:text-2xl font-bold mb-3">
                    רוצים לבנות תוכנית כלכלית שמתאימה לכם?
                  </h2>
                  <p className="text-white/80 mb-6 max-w-lg mx-auto">
                    שיחת היכרות - בלי מחויבות, בלי עלות. נבין יחד איפה
                    אתם נמצאים ומה הצעד הבא.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#e6c350] text-[#1A365D] font-bold px-7 py-3 rounded-xl transition-colors"
                  >
                    קבעו שיחת היכרות
                    <span aria-hidden>←</span>
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-10">
              אין לראות באמור המלצה להשקעה או תחליף לייעוץ מותאם אישית
            </p>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C3879] text-center mb-10">
              מאמרים נוספים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((rp) => {
                const rAccent = categoryAccents[rp.category] ?? fallbackAccent;
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group flex h-full flex-col bg-white rounded-3xl shadow-[0_20px_60px_-25px_rgba(26,54,93,0.2)] border border-gray-100 overflow-hidden hover:shadow-[0_25px_70px_-20px_rgba(26,54,93,0.3)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className="p-5"
                      style={{
                        background: `linear-gradient(135deg, ${rAccent.from}, ${rAccent.to})`,
                      }}
                    >
                      <div
                        className="text-[11px] font-bold tracking-widest uppercase"
                        style={{ color: rAccent.text }}
                      >
                        {rp.category}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-bold text-[#1C3879] leading-snug mb-2 group-hover:text-[#2a4a7a] transition-colors">
                        {rp.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
                        {rp.excerpt}
                      </p>
                      <div className="mt-4 text-xs font-bold text-[#1C3879] inline-flex items-center gap-1.5">
                        <span>קרא עוד</span>
                        <span aria-hidden>←</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
