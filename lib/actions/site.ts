"use server";

import { revalidatePath, updateTag } from "next/cache";

import { getSession } from "@/lib/auth/session";
import { verifyAdminSessionUser } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db";
import { toSiteConfigDTO } from "@/lib/data/serializers";
import { SITE_CONFIG_TAG } from "@/lib/data/site-config";
import { siteConfigSchema } from "@/lib/validations/site";
import { zodFieldErrors } from "@/lib/validations/project";
import { SiteConfig } from "@/models/SiteConfig";
import type { ActionResult, SiteConfigDTO } from "@/lib/types";

export async function updateSiteConfig(
  input: unknown,
): Promise<ActionResult<SiteConfigDTO>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Your session has expired. Sign in again." };
    }

    const user = await verifyAdminSessionUser(session);
    if (!user) {
      return { success: false, error: "You are not authorized to do that." };
    }

    const parsed = siteConfigSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: zodFieldErrors(parsed.error),
      };
    }

    await connectDB();

    const config = await SiteConfig.findOneAndUpdate(
      { key: "main" },
      { $set: { ...parsed.data, key: "main" } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean();

    if (!config) {
      return { success: false, error: "Could not save site settings." };
    }

    updateTag(SITE_CONFIG_TAG);
    revalidatePath("/");
    // Site config feeds the footer and contact details on every /projects
    // surface, including each project detail page.
    revalidatePath("/projects", "layout");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return {
      success: true,
      data: toSiteConfigDTO(
        config as unknown as Parameters<typeof toSiteConfigDTO>[0],
      ),
      message: "Site settings saved.",
    };
  } catch (error) {
    console.error("[site-config] update failed", error);
    return { success: false, error: "Could not save site settings." };
  }
}
