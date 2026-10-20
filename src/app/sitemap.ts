import type { MetadataRoute } from "next";
import { config } from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: config.domain, changeFrequency: "weekly", priority: 1 }];
}
