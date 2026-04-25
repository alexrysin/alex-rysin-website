# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional business website for **Alex Risin — Financial Planning and Financial Independence Coaching**. Hebrew/RTL, built with Next.js 14 App Router + Tailwind CSS + Framer Motion.

## Commands (run from project root)

```sh
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build (TypeScript check included)
npm run start    # Start production server
npm run lint     # ESLint
```

## Tech Stack

- **Next.js 14** with App Router (`/app` directory)
- **TypeScript**
- **Tailwind CSS** with custom brand tokens (`navy`, `blue-mid`, `olive`)
- **Framer Motion** for scroll-reveal animations
- **Heebo** from `next/font/google` (Hebrew + Latin subsets)

## Brand Colors (defined in tailwind.config.ts)

| Token | Hex | Usage |
|-------|-----|-------|
| `navy` / `[#1C3879]` | Deep navy | Primary bg, headings, borders |
| `blue-mid` / `[#4A6FA5]` | Mid blue | Secondary accents |
| `olive` / `[#6B8E23]` | Olive green | CTA buttons ONLY |
| `[#E0E0E0]` | Warm gray | Neutral separators |

## Architecture

### Pages (`/app`)
| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | Home — 6 sections (Hero, Pain, Process, Why Alex, Testimonials, CTA) |
| `/about` | `app/about/page.tsx` | Profile + story + professional network |
| `/blog` | `app/blog/page.tsx` | Article listing grid (static placeholders) |
| `/testimonials` | `app/testimonials/page.tsx` | Testimonials grid (placeholders) |
| `/contact` | `app/contact/page.tsx` | Form (Formspree) + WhatsApp sidebar |

Metadata is exported from `app/about/layout.tsx` and `app/contact/layout.tsx` (server components) because the page files use `"use client"`.

### Shared Components (`/components`)
- `Header.tsx` — Sticky nav, mobile hamburger, CTA button
- `Footer.tsx` — Navy bg, 3-column layout
- `WhatsAppButton.tsx` — Fixed floating button, bottom-left

### RTL Rules
- `dir="rtl"` and `lang="he"` are set on `<html>` in `app/layout.tsx`
- Use `border-r-4` (not `border-l-4`) for card left-side accents in RTL
- Use `text-right` explicitly where needed

### Images
Photos are in both `assets/` (original) and `public/assets/` (served by Next.js). Reference them as `/assets/filename.jpg`.

## Content Placeholders

Real content to be filled in later is marked with Hebrew bracket notation:
- `[ציטוט לקוח — שם וציטוט יתווספו כאן]` — Testimonials
- `[סיפור אישי של אלכס יתווסף כאן]` — About page story
- Formspree endpoint: configured in `app/contact/page.tsx` (form ID `xrerjwgy`)
- WhatsApp number: replace `972501234567` across all files

## SEO

Each page has its own metadata. Server-layout files (`app/about/layout.tsx`, `app/contact/layout.tsx`) carry the metadata for `"use client"` pages.
