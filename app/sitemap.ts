import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://easyraabta.com"
).replace(/\/$/, "");

const routes = [
  "",
  "/about",
  "/buy",
  "/rent",
  "/featured",
  "/commercial",
  "/plots",
  "/post-property",
  "/contact",
  "/faqs",
  "/blog",
  "/terms",
  "/privacy-policy",
  "/refund-policy",
  "/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
