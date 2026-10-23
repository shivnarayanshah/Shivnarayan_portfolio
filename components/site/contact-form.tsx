"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/lib/actions/contact";
import { contactFormSchema } from "@/lib/validations/forms";

const initialValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative rounded-[1.6rem] border border-line bg-surface/40 p-5 backdrop-blur-sm sm:p-8">
      {sent ? (
        <div className="flex min-h-[26rem] flex-col items-center justify-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-sage/30 bg-sage/10 text-sage">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h3 className="mt-5 font-display text-3xl tracking-tight text-ink">
            Message received.
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Thanks for reaching out. I&apos;ll read it properly and get back to
            you soon. If it&apos;s urgent, email me directly at{" "}
            <a href={`mailto:${email}`} className="text-accent underline">
              {email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-7 text-sm font-medium text-ink underline underline-offset-4"
          >
            Send another message
          </button>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={contactFormSchema}
          onSubmit={async (values, helpers) => {
            helpers.setStatus(null);
            const result = await submitContact(values);
            if (result.success) {
              toast.success(result.message ?? "Message sent.");
              helpers.resetForm();
              setSent(true);
              return;
            }
            helpers.setStatus(result.error);
            toast.error(result.error);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            status,
          }) => (
            <Form noValidate className="space-y-5">
              <div className="mb-6">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">
                  Project enquiry
                </p>
                <h2 className="mt-2 font-display text-3xl tracking-tight text-ink">
                  Tell me about it.
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  name="name"
                  label="Your name"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name ? errors.name : undefined}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="jane@company.com"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : undefined}
                  required
                />
              </div>

              <Input
                name="subject"
                label="Subject"
                placeholder="A new product, a rebuild, a role…"
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.subject ? errors.subject : undefined}
              />

              <Textarea
                name="message"
                label="Message"
                placeholder="What are you building, and where are you stuck?"
                rows={7}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message ? errors.message : undefined}
                required
              />

              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Leave this empty</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={handleChange}
                />
              </div>

              {status ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-600 dark:text-red-400"
                >
                  {status}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                <p className="max-w-[15rem] text-[0.68rem] leading-relaxed text-muted">
                  Your details are only used to reply. No lists, no noise.
                </p>
                <Button type="submit" loading={isSubmitting} size="lg">
                  {isSubmitting ? "Sending…" : "Send message"}
                  {!isSubmitting ? <Send className="h-4 w-4" /> : null}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
