"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { posts } from "@/content/posts";

// ============================================================================
// Blog index - curated essays by Alex Rysin on financial planning and
// financial independence. Features one highlighted post plus a filterable grid.
// ============================================================================

const CATEGORY_ALL = "הכל";

// Per-category accent gradients - echo the /tools page visual language.
const categoryAccents: Record<string, { from: string; to: string; text: string }> = {
  'נדל"ן':        { from: "#1A365D", to: "#2a4a7a", text: "#5AC8C8" },
  "השקעות":       { from: "#5AC8C8", to: "#4ab8b8", text: "#ffffff" },
  "תכנון פיננסי": { from: "#1A365D", to: "#3b5a88", text: "#D4AF37" },
  "מיינדסט":       { from: "#D4AF37", to: "#e6c350", text: "#1A365D" },
  "תפיסת עולם":   { from: "#1A365D", to: "#4a6fa5", text: "#D4AF37" },
  "קבלת החלטות":  { from: "#5AC8C8", to: "#1A365D", text: "#ffffff" },
};

const fallbackAccent = { from: "#1A365D", to: "#2a4a7a", text: "#5AC8C8" };

export default function BlogPage() {
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return [CATEGORY_ALL, ...Array.from(set)];
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>(CATEGORY_ALL);

  const featured = posts.find((p) => p.featured) ?? posts[0];

  const filtered = useMemo(() => {
    const rest = posts.filter((p) => p.slug !== featured.slug);
    if (activeCategory === CATEGORY_ALL) return rest;
    return rest.filter((p) => p.category === activeCategory);
  }, [activeCategory, featured]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-14 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5AC8C8]/10 border border-[#5AC8C8]/30 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#5AC8C8]" />
            <span className="text-xs font-bold text-[#1C3879] tracking-wider">
              הבלוג
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-[2.6rem] font-bold text-[#1C3879] leading-tight mb-5"
          >
            מחשבות על כסף, השקעות וחירות
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            מאמרים מעשיים על תכנון פיננסי, נדל״ן, שוק ההון וחופש כלכלי - בלי עגה
            מקצועית, בלי בלגן, עם דוגמאות מהחיים האמיתיים.
          </motion.p>
        </div>

        {/* Featured post - larger card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-16"
        >
          <FeaturedCard post={featured} />
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {allCategories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active ? "text-white" : "text-gray-600 hover:text-[#1C3879]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="blog-cat-pill"
                    className="absolute inset-0 bg-[#1C3879] rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {filtered.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            אין מאמרים בקטגוריה זו כרגע.
          </p>
        )}

        {/* Closing note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center text-xs text-gray-400 mt-14"
        >
          כל המאמרים נכתבו ונערכו על ידי אלכס ריסין &middot; אין לראות באמור המלצה
          להשקעה או תחליף לייעוץ מותאם אישית
        </motion.p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Featured card - one large, visually prominent card at the top of the index.
// ----------------------------------------------------------------------------

function FeaturedCard({ post }: { post: (typeof posts)[number] }) {
  const accent = categoryAccents[post.category] ?? fallbackAccent;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-3xl shadow-[0_25px_70px_-25px_rgba(26,54,93,0.25)] border border-gray-100 overflow-hidden hover:shadow-[0_30px_80px_-20px_rgba(26,54,93,0.35)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Visual side - uses post.image when provided, else a gradient panel. */}
        <div
          className="relative md:col-span-2 overflow-hidden min-h-[220px] md:min-h-[320px]"
          style={
            post.image
              ? undefined
              : { background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }
          }
        >
          {post.image ? (
            <>
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </>
          ) : (
            <>
              <div
                aria-hidden
                className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              />
              <div
                aria-hidden
                className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl translate-y-1/2"
              />
            </>
          )}
          <div className="relative p-8 md:p-10 h-full flex flex-col justify-between">
            <div>
              <div
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: accent.text }}
              >
                מומלץ לקריאה
              </div>
              <div className="text-white/90 text-sm font-semibold">
                {post.category}
              </div>
            </div>
            {!post.image && (
              <div className="text-5xl md:text-6xl leading-none" aria-hidden>
                ✦
              </div>
            )}
          </div>
        </div>

        {/* Text side */}
        <div className="md:col-span-3 p-7 md:p-10 flex flex-col">
          <div className="text-xs text-gray-400 mb-3">
            קריאה של {post.readMinutes} דקות
          </div>
          <h2 className="text-2xl md:text-[1.7rem] font-bold text-[#1C3879] leading-snug mb-4 group-hover:text-[#2a4a7a] transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-base mb-6 flex-1">
            {post.excerpt}
          </p>
          <div className="inline-flex items-center gap-2 text-[#1C3879] font-bold text-sm group-hover:gap-3 transition-all">
            <span>קרא את המאמר המלא</span>
            <span aria-hidden>←</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ----------------------------------------------------------------------------
// Regular post card - used in the filterable grid below the featured post.
// ----------------------------------------------------------------------------

function PostCard({ post }: { post: (typeof posts)[number] }) {
  const accent = categoryAccents[post.category] ?? fallbackAccent;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col bg-white rounded-3xl shadow-[0_20px_60px_-25px_rgba(26,54,93,0.2)] border border-gray-100 overflow-hidden hover:shadow-[0_25px_70px_-20px_rgba(26,54,93,0.3)] hover:-translate-y-1 transition-all duration-300"
    >
      {/* Top visual - image with gradient overlay, or gradient-only if no image */}
      <div
        className="relative overflow-hidden aspect-[16/9]"
        style={
          post.image
            ? undefined
            : { background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }
        }
      >
        {post.image ? (
          <>
            <Image
              src={post.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </>
        ) : (
          <div
            aria-hidden
            className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
          />
        )}
        <div className="relative h-full p-5 md:p-6 flex items-start">
          <div
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: accent.text }}
          >
            {post.category}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <h2 className="text-lg md:text-xl font-bold text-[#1C3879] leading-snug mb-3 group-hover:text-[#2a4a7a] transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-600 leading-relaxed text-sm mb-5 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs font-semibold text-gray-400">
            ⏱ {post.readMinutes} דק׳
          </div>
          <div className="inline-flex items-center gap-2 text-[#1C3879] font-bold text-sm group-hover:gap-3 transition-all">
            <span>קרא עוד</span>
            <span aria-hidden>←</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
