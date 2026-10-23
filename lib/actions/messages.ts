"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

import { getSession } from "@/lib/auth/session";
import { verifyAdminSessionUser } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import type { ActionResult } from "@/lib/types";

async function authorize() {
  const session = await getSession();
  if (!session) return false;
  const user = await verifyAdminSessionUser(session);
  return Boolean(user);
}

export async function toggleMessageRead(
  id: string,
): Promise<ActionResult<{ id: string; read: boolean }>> {
  try {
    if (!(await authorize())) {
      return { success: false, error: "You are not authorized to do that." };
    }
    if (!Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid message ID." };
    }

    await connectDB();
    const message = await ContactMessage.findById(id);
    if (!message) return { success: false, error: "Message not found." };

    message.read = !message.read;
    await message.save();

    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return {
      success: true,
      data: { id, read: message.read },
      message: message.read ? "Marked as read." : "Marked as unread.",
    };
  } catch (error) {
    console.error("[messages] toggle failed", error);
    return { success: false, error: "Could not update the message." };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    if (!(await authorize())) {
      return { success: false, error: "You are not authorized to do that." };
    }
    if (!Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid message ID." };
    }

    await connectDB();
    const deleted = await ContactMessage.findByIdAndDelete(id).lean();
    if (!deleted) return { success: false, error: "Message not found." };

    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return { success: true, data: { id }, message: "Message deleted." };
  } catch (error) {
    console.error("[messages] delete failed", error);
    return { success: false, error: "Could not delete the message." };
  }
}
