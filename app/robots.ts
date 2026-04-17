import type { MetadataRoute } from "next";

// Pre-launch: deny all crawlers. When ready to launch, change to:
//   rules: [{ userAgent: "*", allow: "/" }]
// and add a sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
