import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { FIELD_LENSES } from "@/lib/lens";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...FIELD_LENSES.map((l) => `/${l}/`), "/timeline/", "/about/", ...projects.map((p) => `/work/${p.slug}/`)];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
