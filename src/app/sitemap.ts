import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { createPublicClient } from "@/lib/supabase/server";

const STATIC_ROUTES = [
  "",
  "/jewellery",
  "/jewellery/gold",
  "/jewellery/silver",
  "/collections",
  "/offers",
  "/gold-rate",
  "/services",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();

  const [{ data: products }, { data: collections }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
    supabase.from("collections").select("slug").eq("is_active", true),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/gold-rate" ? "daily" : "weekly",
  }));

  const productEntries: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${siteConfig.siteUrl}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly",
  }));

  const collectionEntries: MetadataRoute.Sitemap = (collections ?? []).map((c) => ({
    url: `${siteConfig.siteUrl}/collections/${c.slug}`,
    changeFrequency: "weekly",
  }));

  return [...staticEntries, ...productEntries, ...collectionEntries];
}
