import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getSiteConfigForAdmin } from "@/lib/data/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Site settings" };

export default async function AdminSettingsPage() {
  const config = await getSiteConfigForAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Configuration"
        title="Site settings"
        description="The identity, hero copy, contact details, and links used across the public site."
        actions={
          <Link href="/" target="_blank" className="btn-secondary">
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
        }
      />
      <SiteSettingsForm config={config} />
    </div>
  );
}
