import "server-only";

import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "h2",
  "h3",
  "h4",
  "p",
  "a",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "s",
  "blockquote",
  "code",
  "pre",
  "br",
  "hr",
];

/**
 * Project descriptions are authored in Tiptap by a trusted admin, but they are
 * still sanitized before being injected into the public page.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attributes) => {
        const next: Record<string, string> = {
          ...attributes,
          rel: "noopener noreferrer",
        };
        if (attributes.href?.startsWith("http")) {
          next.target = "_blank";
        } else {
          delete next.target;
        }
        return { tagName, attribs: next };
      },
    },
  });
}
