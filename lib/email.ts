import "server-only";

import { Resend } from "resend";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

interface ContactEmailInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(input: ContactEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY is not set." };

  const to = process.env.CONTACT_TO_EMAIL ?? "shivnarayan2072@gmail.com";
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: input.email,
      subject: `Portfolio enquiry — ${input.subject}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Subject: ${input.subject}`,
        "",
        input.message,
      ].join("\n"),
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:620px;margin:0 auto;padding:32px;color:#1c1914">
          <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#9b5a3b;margin:0 0 20px">New portfolio enquiry</p>
          <h1 style="font-size:26px;line-height:1.2;margin:0 0 24px">${escapeHtml(input.subject)}</h1>
          <p style="margin:0 0 8px"><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p>
          <div style="margin-top:24px;padding:20px;border:1px solid #e8dfd1;border-radius:12px;background:#faf6ee;white-space:pre-wrap;line-height:1.7">${escapeHtml(input.message)}</div>
          <p style="margin-top:24px;font-size:12px;color:#7c7265">Sent from shivnarayan.com.np</p>
        </div>
      `,
    });

    if (error) {
      console.error("[email] Resend rejected the message", error.message);
      return { sent: false, reason: error.message };
    }

    return { sent: true };
  } catch (error) {
    console.error("[email] send failed", error);
    return { sent: false, reason: "Email delivery failed." };
  }
}
