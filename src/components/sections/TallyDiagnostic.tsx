'use client'
import Script from 'next/script'

type TallyDiagnosticProps = {
  formId: string
}

export function TallyDiagnostic({ formId }: TallyDiagnosticProps) {
  if (!formId) {
    return (
      <div className="rounded-xl border border-border-subtle bg-canvas-elevated p-8 text-center">
        <p className="text-label text-muted-strong mb-2">HR Diagnostic</p>
        <p className="text-heading-md mb-4">Understand your highest-leverage people priority in 5 minutes.</p>
        <p className="text-body text-ink-soft mb-6">Launching soon. In the meantime, book a discovery call for a personalized assessment.</p>
        <a href="/contact" className="btn-primary">Book a Discovery Call</a>
      </div>
    )
  }

  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1`}
        width="100%"
        height="500"
        frameBorder="0"
        title="HR Diagnostic"
      />
    </>
  )
}
