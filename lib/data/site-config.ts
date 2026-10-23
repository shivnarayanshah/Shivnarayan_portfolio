import "server-only";

import { unstable_cache } from "next/cache";

import { connectDB } from "@/lib/db";
import { FALLBACK_SITE_CONFIG } from "@/lib/data/fallback";
import { toSiteConfigDTO } from "@/lib/data/serializers";
import { SiteConfig } from "@/models/SiteConfig";
import type { SiteConfigDTO } from "@/lib/types";

export const SITE_CONFIG_TAG = "site-config";

async function querySiteConfig(): Promise<SiteConfigDTO> {
  try {
    await connectDB();
    const config = await SiteConfig.findOne({ key: "main" }).lean();
    if (!config) return FALLBACK_SITE_CONFIG;
    return toSiteConfigDTO(
      config as unknown as Parameters<typeof toSiteConfigDTO>[0],
    );
  } catch (error) {
    console.warn(
      `[site-config] falling back to static content: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
    return FALLBACK_SITE_CONFIG;
  }
}

export const getSiteConfig = unstable_cache(querySiteConfig, ["site-config"], {
  tags: [SITE_CONFIG_TAG],
  revalidate: 3_600,
});

export async function getSiteConfigForAdmin(): Promise<SiteConfigDTO> {
  await connectDB();
  const config = await SiteConfig.findOne({ key: "main" }).lean();
  if (!config) return FALLBACK_SITE_CONFIG;
  return toSiteConfigDTO(
    config as unknown as Parameters<typeof toSiteConfigDTO>[0],
  );
}
