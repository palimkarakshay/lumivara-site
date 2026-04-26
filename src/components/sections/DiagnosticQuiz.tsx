"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import {
  diagnosticQuestions,
  scoreDiagnostic,
  buildDiagnosticSummary,
  type DiagnosticAnswers,
} from "@/content/diagnostic";
import { services, getServiceBySlug } from "@/content/services";
import { cn } from "@/lib/utils";

type DiagnosticQuizProps = {
  className?: string;
};

export function DiagnosticQuiz({ className }: DiagnosticQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [completed, setCompleted] = useState(false);

  const total = diagnosticQuestions.length;
  const current = diagnosticQuestions[step];
  const progress = Math.round(((step + (completed ? 1 : 0)) / total) * 100);

  const result = useMemo(
    () => (completed ? scoreDiagnostic(answers) : null),
    [completed, answers]
  );

  function pick(value: string) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (step + 1 >= total) {
      setCompleted(true);
    } else {
      setStep(step + 1);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setCompleted(false);
  }

  if (completed && result) {
    const primary = getServiceBySlug(result.primarySlug);
    const alsoServices = result.alsoRecommend
      .map((s) => getServiceBySlug(s))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));

    const summaryServiceNames = [
      primary?.title,
      ...alsoServices.map((s) => s.title),
    ]
      .filter(Boolean)
      .join(" and ");

    const diagnosticSummary = primary
      ? buildDiagnosticSummary(answers, primary.title)
      : "";
    const sendResultsHref = `/contact?service=${result.primarySlug}&diagnosticSummary=${encodeURIComponent(diagnosticSummary)}`;

    return (
      <div
        className={cn(
          "rounded-lg border border-border-subtle bg-canvas-elevated p-6 sm:p-8",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-label text-accent-deep">
            <Check size={14} aria-hidden /> Diagnostic complete
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 text-label text-muted-strong transition-colors hover:text-ink"
          >
            <RotateCcw size={12} aria-hidden /> Retake
          </button>
        </div>

        <p className="text-body text-ink-soft mt-6 leading-relaxed">
          Your answers suggest{" "}
          <span className="font-medium text-ink">{summaryServiceNames}</span>{" "}
          {alsoServices.length > 0 ? "are" : "is"} your highest-leverage{" "}
          {alsoServices.length > 0 ? "priorities" : "priority"}.
        </p>

        {primary && (
          <>
            <p className="text-label text-muted-strong mt-6">Where to start</p>
            <h3 className="font-display text-2xl text-ink mt-2 leading-tight sm:text-3xl">
              {primary.title}
            </h3>
            <p className="text-body text-ink-soft mt-3 leading-relaxed">
              {primary.tagline}
            </p>
            <p className="text-body-sm text-muted-strong mt-4 italic">
              {result.urgencyNote}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/contact?service=${primary.slug}`}
                className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-colors hover:bg-accent hover:text-ink"
              >
                Book a Discovery Call
                <ArrowRight size={14} aria-hidden />
              </Link>
              <Link
                href={sendResultsHref}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent-soft"
              >
                Send us your results
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </>
        )}
        {alsoServices.length > 0 && (
          <div className="mt-8 border-t border-border-subtle pt-6">
            <p className="text-label text-muted-strong mb-3">Worth exploring</p>
            <ul className="flex flex-col gap-2">
              {alsoServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/what-we-do/${s.slug}`}
                    className="group flex items-center justify-between rounded-md border border-border-subtle bg-canvas-elevated px-4 py-3 text-body-sm text-ink transition-colors hover:border-accent"
                  >
                    <span>{s.title}</span>
                    <ArrowRight
                      size={14}
                      aria-hidden
                      className="text-muted-strong transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-caption text-muted-strong mt-6">
          Anonymous — answers are not saved or transmitted.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border-subtle bg-canvas-elevated p-6 sm:p-8",
        className
      )}
    >
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-label text-muted-strong">
            Question {step + 1} of {total}
          </span>
          <span className="text-label text-muted-strong">{progress}%</span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-border-subtle"
          role="progressbar"
          aria-label="Assessment progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <h3 className="font-display text-2xl text-ink leading-tight sm:text-3xl">
        {current.prompt}
      </h3>
      <ul className="mt-6 flex flex-col gap-2">
        {current.options.map((opt) => (
          <li key={opt.value}>
            <button
              type="button"
              onClick={() => pick(opt.value)}
              className="group flex w-full items-center justify-between gap-3 rounded-md border border-border-subtle bg-canvas px-4 py-3.5 text-left text-body-sm text-ink-soft transition-all hover:border-accent hover:bg-canvas-elevated hover:text-ink"
            >
              <span>{opt.label}</span>
              <ArrowRight
                size={14}
                aria-hidden
                className="shrink-0 text-muted-strong transition-all group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </button>
          </li>
        ))}
      </ul>
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-5 text-label text-muted-strong transition-colors hover:text-ink"
        >
          ← Back
        </button>
      )}
      <p className="text-caption text-muted-strong mt-6">
        {services.length} services · 4 questions · 60 seconds
      </p>
    </div>
  );
}
