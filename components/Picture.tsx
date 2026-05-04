// <Picture> — drop-in replacement for <img> that serves WebP with JPG fallback.
// Conversion produces alongside each <name>.<ext>:
//   <name>.webp                — full-size WebP (always exists)
//   <name>-400w.webp etc.      — multi-size variants (only when source >= width)
//
// Default: single full-size WebP via <source>, original src as <img> fallback.
// Pass `responsive` to use srcset (only safe when all sizes were generated —
// see scripts/convert-images.mjs output to confirm).

import { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** Sets loading=eager + fetchPriority=high (use for above-the-fold). */
  priority?: boolean;
  /** Sizes attribute (only used when responsive=true). */
  sizes?: string;
  /** Use srcset with 400w/800w/1200w variants. Verify they exist first. */
  responsive?: boolean;
  width?: number;
  height?: number;
};

const SRCSET_WIDTHS = [400, 800, 1200];

function deriveWebpPaths(src: string, responsive: boolean) {
  const dotIdx = src.lastIndexOf(".");
  if (dotIdx === -1) return { single: src, srcset: "" };
  const base = src.substring(0, dotIdx);
  const single = `${base}.webp`;
  const srcset = responsive
    ? SRCSET_WIDTHS.map((w) => `${base}-${w}w.webp ${w}w`).join(", ")
    : "";
  return { single, srcset };
}

export default function Picture({
  src,
  alt,
  className,
  style,
  priority = false,
  sizes,
  responsive = false,
  width,
  height,
}: Props) {
  const { single, srcset } = deriveWebpPaths(src, responsive);
  const loadingProps = priority
    ? { loading: "eager" as const, fetchPriority: "high" as const, decoding: "async" as const }
    : { loading: "lazy" as const, decoding: "async" as const };

  return (
    <picture>
      {responsive && srcset ? (
        <source type="image/webp" srcSet={srcset} sizes={sizes} />
      ) : (
        <source type="image/webp" srcSet={single} />
      )}
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
