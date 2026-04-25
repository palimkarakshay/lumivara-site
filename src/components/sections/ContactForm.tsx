"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { contactContent } from "@/content/contact";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const inquirySchema = z.object({
  type: z.literal("inquiry"),
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Use a valid email"),
  organization: z.string().max(200).optional(),
  size: z.string().max(64).optional(),
  interests: z.array(z.string()).optional(),
  timeline: z.string().max(64).optional(),
  message: z.string().min(10, "A sentence or two helps us respond well").max(4000),
  consent: z.boolean().refine((v) => v === true, {
    message: "We need your consent to respond.",
  }),
});

type InquiryValues = z.infer<typeof inquirySchema>;

function ContactFormInner() {
  const searchParams = useSearchParams();
  const presetService = searchParams.get("service");
  const { inquiry } = contactContent;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      type: "inquiry",
      name: "",
      email: "",
      organization: "",
      size: "",
      interests: presetService ? [presetService] : [],
      timeline: "",
      message: "",
      consent: false,
    },
  });

  useEffect(() => {
    if (presetService) {
      reset((prev) => ({ ...prev, interests: [presetService] }));
    }
  }, [presetService, reset]);

  async function onSubmit(values: InquiryValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full flex-col gap-4 rounded-lg border border-accent bg-canvas-elevated p-6 sm:p-8">
        <Check size={24} className="text-accent" aria-hidden />
        <h2 className="font-display text-2xl text-ink leading-tight sm:text-3xl">
          {inquiry.success.heading}
        </h2>
        <p className="text-body text-ink-soft leading-relaxed">
          {inquiry.success.body}
        </p>
        <p className="font-mono text-label text-accent-deep mt-4">
          {inquiry.success.signoff}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 rounded-lg border border-border-subtle bg-canvas-elevated p-6 sm:p-8">
      <div>
        <p className="text-label text-muted-strong mb-2">{inquiry.label}</p>
        <h2 className="font-display text-2xl text-ink leading-tight sm:text-3xl">
          Share what you&apos;re working through.
        </h2>
        <p className="text-body-sm text-ink-soft mt-2">{inquiry.body}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label={inquiry.fields.name.label} error={errors.name?.message} required>
          <input
            type="text"
            {...register("name")}
            className="input"
            autoComplete="name"
          />
        </Field>

        <Field
          label={inquiry.fields.email.label}
          error={errors.email?.message}
          required
        >
          <input
            type="email"
            {...register("email")}
            className="input"
            autoComplete="email"
            inputMode="email"
          />
        </Field>

        <Field
          label={inquiry.fields.organization.label}
          error={errors.organization?.message}
        >
          <input
            type="text"
            {...register("organization")}
            className="input"
            autoComplete="organization"
          />
        </Field>

        <Field label={inquiry.fields.size.label} error={errors.size?.message}>
          <select {...register("size")} className="input">
            <option value="">Select</option>
            {inquiry.fields.size.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>

        <Controller
          name="interests"
          control={control}
          render={({ field }) => (
            <Field label={inquiry.fields.interests.label}>
              <div className="flex flex-wrap gap-2">
                {inquiry.fields.interests.options.map((opt) => {
                  const selected = field.value?.includes(opt.value) ?? false;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const current = field.value ?? [];
                        field.onChange(
                          selected
                            ? current.filter((v) => v !== opt.value)
                            : [...current, opt.value]
                        );
                      }}
                      aria-pressed={selected}
                      className={cn(
                        "text-label rounded-md border px-3 py-1.5 transition-all",
                        selected
                          ? "border-accent bg-accent text-ink"
                          : "border-border-subtle bg-canvas text-muted-strong hover:border-accent hover:text-ink"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}
        />

        <Field label={inquiry.fields.timeline.label} error={errors.timeline?.message}>
          <select {...register("timeline")} className="input">
            <option value="">Select</option>
            {inquiry.fields.timeline.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={inquiry.fields.message.label}
          error={errors.message?.message}
          required
        >
          <textarea
            {...register("message")}
            rows={5}
            placeholder={inquiry.fields.message.placeholder}
            className="input resize-none"
          />
        </Field>

        <label className="flex items-start gap-3 text-body-sm text-ink-soft leading-snug">
          <input
            type="checkbox"
            {...register("consent")}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border-subtle accent-accent"
          />
          <span>
            {inquiry.fields.consent.label.replace(" privacy policy.", " ")}
            <Link
              href="/privacy"
              className="text-accent-deep underline underline-offset-2 hover:text-accent"
            >
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p className="text-caption text-error -mt-3">{errors.consent.message}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-3.5 font-medium text-canvas transition-colors hover:bg-accent hover:text-ink disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              {inquiry.submit}
              <ArrowRight size={16} aria-hidden />
            </>
          )}
        </button>

        {status === "error" && (
          <p className="text-caption text-error">
            Something went wrong. Email us directly at{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="underline underline-offset-2"
            >
              {siteConfig.email}
            </a>
            .
          </p>
        )}
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--canvas);
          padding: 10px 12px;
          color: var(--ink);
          font-size: 15px;
          font-family: inherit;
          transition: border-color 0.15s ease;
        }
        .input:focus {
          border-color: var(--accent);
        }
        .input:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        .input::placeholder {
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label text-muted-strong">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
      {error && <span className="text-caption text-error">{error}</span>}
    </label>
  );
}

export function ContactForm() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center rounded-lg border border-border-subtle bg-canvas-elevated p-6">
          <Loader2 size={20} className="animate-spin text-muted-strong" aria-hidden />
        </div>
      }
    >
      <ContactFormInner />
    </Suspense>
  );
}
