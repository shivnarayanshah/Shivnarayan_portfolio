import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { MessagesList } from "@/components/admin/messages-list";
import { getAdminMessages } from "@/lib/data/messages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();
  const unread = messages.filter((message) => !message.read).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Inbox"
        title="Messages"
        description={
          unread
            ? `${unread} unread ${unread === 1 ? "enquiry" : "enquiries"} from the contact form.`
            : "Every enquiry from the contact form, in one place."
        }
      />
      <MessagesList messages={messages} />
    </div>
  );
}
