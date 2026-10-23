"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { verifyAdminCredentials } from "@/lib/auth/dal";
import { rateLimit } from "@/lib/auth/rate-limit";
import { createSession, deleteSession } from "@/lib/auth/session";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import type { ActionResult } from "@/lib/types";

function getClientIp(headerList: Headers) {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return headerList.get("x-real-ip") ?? "unknown";
}

export async function loginAction(
  input: LoginInput,
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Enter a valid email and password.",
      };
    }

    const headerList = await headers();
    const ip = getClientIp(headerList);
    const limit = rateLimit(
      `login:${ip}:${parsed.data.email}`,
      5,
      10 * 60 * 1_000,
    );

    if (!limit.success) {
      return {
        success: false,
        error: `Too many sign-in attempts. Try again in ${Math.ceil(
          limit.retryAfterSeconds / 60,
        )} minutes.`,
      };
    }

    const user = await verifyAdminCredentials(
      parsed.data.email,
      parsed.data.password,
    );

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    await createSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: "admin",
    });

    return {
      success: true,
      data: { redirectTo: "/admin/dashboard" },
      message: `Welcome back, ${user.name.split(" ")[0]}.`,
    };
  } catch (error) {
    console.error("[auth] login failed", error);
    return {
      success: false,
      error:
        "Could not sign you in right now. Check the database connection and try again.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}
