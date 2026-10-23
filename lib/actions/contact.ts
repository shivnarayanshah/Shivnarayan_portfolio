"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/auth/rate-limit";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { ContactMessage } from "@/models/ContactMessage";
import type { ActionResult } from "@/lib/types";

function getClientIp(headerList: Headers) {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return headerList.get("x-real-ip") ?? "unknown";
}

export async function submitContact(
  input: ContactInput,
): Promise<ActionResult<{ received: true }>> {
  try {
    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Please check the form and try again.",
      };
    }

    // Honeypot: silently accept bot submissions without storing them.
    if (parsed.data.website) {
      return {
        success: true,
        data: { received: true },
        message: "Thanks — your message has been received.",
      };
    }

    const headerList = await headers();
    const ip = getClientIp(headerList);
    const limit = rateLimit(`contact:${ip}`, 3, 10 * 60 * 1_000);

    if (!limit.success) {
      return {
        success: false,
        error: "You have sent several messages already. Please try again later.",
      };
    }

    await connectDB();

    const message = await ContactMessage.create({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || "Portfolio enquiry",
      message: parsed.data.message,
    });

    // Email is best-effort: the message is already safely stored.
    const emailResult = await sendContactEmail(parsed.data);
    if (!emailResult.sent) {
      console.warn(`[contact] email not sent: ${emailResult.reason}`);
    }

    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: { received: true },
      message: "Thanks for reaching out. I’ll get back to you soon.",
    };
  } catch (error) {
    console.error("[contact] submission failed", error);
    return {
      success: false,
      error:
        "Could not send your message right now. Please email me directly at shivnarayan2072@gmail.com.",
    };
  }
}
