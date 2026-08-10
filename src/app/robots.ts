import type { MetadataRoute } from "next";

const basePath = process.env.BASE_PATH ?? "";
const siteUrl = `https://maku85.github.io${basePath}`;

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
