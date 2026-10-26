import type { MetadataRoute } from "next";
import { legal } from "@/content/legal";
import { method } from "@/content/method";
import { products } from "@/content/products";
import { site } from "@/content/site";
import { work } from "@/content/work";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/studio/",
    "/work/",
    "/products/",
    "/school/",
    "/lab-notes/",
    "/company/",
    "/procurement/",
    "/contact/",
    ...method.map((s) => `/method/${s.slug}/`),
    ...work.map((w) => `/work/${w.slug}/`),
    ...products.map((p) => `/products/${p.slug}/`),
    ...legal.map((d) => `/legal/${d.slug}/`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
