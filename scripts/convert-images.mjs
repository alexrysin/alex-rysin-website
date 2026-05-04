// Convert all JPG/PNG in public/assets to WebP (and AVIF) at multiple widths
// for srcset. Originals stay untouched (fallback for old browsers).
//
// Usage: node scripts/convert-images.mjs
//
// Outputs: alongside each <name>.<ext>:
//   <name>-<width>w.webp   (e.g. squeeze-400w.webp, squeeze-800w.webp)
//   <name>.webp            (full-size WebP, single-image fallback)

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), "..", "public", "assets");
const WIDTHS = [400, 800, 1200];
const QUALITY = { webp: 82, avif: 60 };
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function* walkImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walkImages(full);
    } else if (e.isFile()) {
      const { ext } = parse(e.name);
      if (EXTENSIONS.has(ext.toLowerCase())) yield full;
    }
  }
}

async function convertOne(file) {
  const { dir, name } = parse(file);
  const meta = await sharp(file).metadata();
  const origWidth = meta.width || 1200;

  const targets = WIDTHS.filter((w) => w <= origWidth);
  if (targets.length === 0) targets.push(origWidth);

  const tasks = [];
  // Multi-size WebP for srcset
  for (const w of targets) {
    const out = join(dir, `${name}-${w}w.webp`);
    tasks.push(
      sharp(file)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY.webp })
        .toFile(out),
    );
  }
  // Single full-size WebP for simple cases (no srcset needed)
  tasks.push(
    sharp(file)
      .webp({ quality: QUALITY.webp })
      .toFile(join(dir, `${name}.webp`)),
  );

  const results = await Promise.all(tasks);
  const totalKb = results.reduce((sum, r) => sum + r.size, 0) / 1024;
  console.log(`  ${name} → ${results.length} variants (${totalKb.toFixed(0)} KB total)`);
}

console.log(`Scanning ${ROOT}...`);
const files = [];
for await (const f of walkImages(ROOT)) files.push(f);
console.log(`Found ${files.length} source images. Converting...\n`);

for (const file of files) {
  await convertOne(file);
}

console.log(`\nDone. ${files.length} images converted.`);
