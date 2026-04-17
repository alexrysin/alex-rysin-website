/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — produces a plain HTML/CSS/JS site under `out/` that can
  // be uploaded to any Apache host (cPanel, box.co.il, etc.). No Node server
  // is required at runtime.
  output: "export",

  // Static export means no Image Optimization API, so every <Image> must use
  // unoptimized URLs.
  images: {
    unoptimized: true,
  },

  // cPanel/Apache serves paths with trailing slashes by default. This flag
  // makes Next emit `/blog/tel-aviv-bat-yam/index.html` instead of
  // `/blog/tel-aviv-bat-yam.html`, which plays well with .htaccess and
  // matches what Apache expects.
  trailingSlash: true,

  // Noindex headers are enforced by .htaccess at the Apache level instead of
  // this config, because `output: "export"` disables `headers()`.
};

module.exports = nextConfig;
