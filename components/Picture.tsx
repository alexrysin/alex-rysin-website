// <Picture> — drop-in replacement for <img> that serves WebP with JPG fallback.
// Conversion produces alongside each <name>.<ext>:
//   <name>.webp                 — full-size WebP
//   <name>-400w.webp / 800w / 1200w  — multi-size WebP for srcset
//
// Usage:
//   <Picture src="/assets/squeeze.jpg" alt="..." className="..." sizes="..." />
//   <Picture src="/assets/squeeze.jpg" alt="..." priority />
//
// Falls back to <img> with original src for browsers that don't accept WebP.

import { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** Sets loading=eager + fetchPriority=high (use for above-the-fold). */
  priority?: boolean;
  /** Sizes attribute for srcset selection. Default: 100vw. */
  sizes?: string;
  width?: number;
  height?: number;
};

const SRCSET_WIDTHS = [400, 800, 1200];

function deriveWebpPaths(src: string) {
  const dotIdx = src.lastIndexOf(".");
  if (dotIdx === -1) return { single: src, srcset: "" };
  const base = src.substring(0, dotIdx);
  const single = `${base}.webp`;
  const srcset = SRCSET_WIDTHS.map((w) => `${base}-${w}w.webp ${w}w`).join(", ");
  return { single, srcset };
}

export default function Picture({
  src,
  alt,
  className,
  style,
  priority = false,
  sizes = "100vw",
  width,
  height,
}: Props) {
  const { single, srcset } = deriveWebpPaths(src);
  const loadingProps = priority
    ? { loading: "eager" as const, fetchPriority: "high" as const, decoding: "async" as const }
    : { loading: "lazy" as const, decoding: "async" as const };

  return (
    <picture>
      <source type="image/webp" srcSet={srcset} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        width={width}
        height={height}
        {...loadingProps}
      />
    </picture>
  );
}
