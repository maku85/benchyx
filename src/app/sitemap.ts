import type { MetadataRoute } from "next";

const basePath = process.env.BASE_PATH ?? "";
const siteUrl = `https://maku85.github.io${basePath}`;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
