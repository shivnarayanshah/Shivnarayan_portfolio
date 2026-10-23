import { NextResponse } from "next/server";

import { verifyAdminSessionUser } from "@/lib/auth/dal";
import { getSession } from "@/lib/auth/session";
import { isCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const user = session ? await verifyAdminSessionUser(session) : null;
    if (!session || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Image uploads are not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    if (!files.length) {
      return NextResponse.json(
        { success: false, error: "No files were provided." },
        { status: 400 },
      );
    }

    if (files.length > 4) {
      return NextResponse.json(
        { success: false, error: "Upload at most 4 images at a time." },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `${file.name}: use a JPG, PNG, WebP, or AVIF image.`,
          },
          { status: 400 },
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `${file.name} is larger than 4 MB.` },
          { status: 400 },
        );
      }
    }

    const folder =
      typeof formData.get("folder") === "string"
        ? String(formData.get("folder")).replace(/[^a-z0-9-]/gi, "")
        : "projects";

    const urls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadImageBuffer(buffer, folder || "projects");
      urls.push(url);
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error("[upload] failed", error);
    return NextResponse.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
