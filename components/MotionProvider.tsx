"use client";

import { LazyMotion, domMax } from "framer-motion";

// LazyMotion + domMax: framer-motion features are loaded once, lazily.
// All animated components in the app use the lighter `m.*` API instead of
// `motion.*`, which strips out the heavy auto-loader from each component.
//
// Bundle savings: ~25-35KB gzipped vs default `motion` import.
//
// `domMax` covers everything we need: animations, gestures, exit animations,
// drag, AND layout animations / layoutId (used in the blog category filter).

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LazyMotion features={domMax} strict={false}>{children}</LazyMotion>;
}
