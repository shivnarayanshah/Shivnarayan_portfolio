"use client";

import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/auth";
import { loginFormSchema } from "@/lib/validations/forms";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginFormSchema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        const result = await loginAction(values);

        if (!result.success) {
          helpers.setStatus(result.error);
          toast.error(result.error);
          return;
        }

        toast.success(result.message ?? "Signed in.");
        // `redirectTo` is sanitized on the server; prefer it over the action's
        // default so `/admin/login?next=…` lands on the requested page.
        router.replace(redirectTo || result.data.redirectTo);
        router.refresh();
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
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="username"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : undefined}
            required
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
            required
          />

          {status ? (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs leading-relaxed text-red-600 dark:text-red-400"
            >
              {status}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
            {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-[0.66rem] text-muted">
            <LockKeyhole className="h-3 w-3" />
            Protected by an httpOnly session cookie
          </p>
        </Form>
      )}
    </Formik>
  );
}
