import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_TAGS = new Set(["projects", "site-config"]);

function isAuthorized(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const header = request.headers.get("x-revalidate-secret");
  const query = request.nextUrl.searchParams.get("secret");
  return header === secret || query === secret;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  const tag = request.nextUrl.searchParams.get("tag") ?? "projects";
  if (!ALLOWED_TAGS.has(tag)) {
    return NextResponse.json(
      { success: false, error: "Unknown cache tag." },
      { status: 400 },
    );
  }

  revalidateTag(tag, "max");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({
    success: true,
    revalidated: tag,
    now: Date.now(),
  });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
