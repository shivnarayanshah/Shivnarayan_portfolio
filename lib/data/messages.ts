import "server-only";

import { connectDB } from "@/lib/db";
import { toMessageDTO } from "@/lib/data/serializers";
import { ContactMessage } from "@/models/ContactMessage";
import type { ContactMessageDTO } from "@/lib/types";

export async function getAdminMessages(): Promise<ContactMessageDTO[]> {
  await connectDB();
  const messages = await ContactMessage.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  return messages.map((message) =>
    toMessageDTO(message as unknown as Parameters<typeof toMessageDTO>[0]),
  );
}

export async function getUnreadMessageCount(): Promise<number> {
  await connectDB();
  return ContactMessage.countDocuments({ read: false });
}
