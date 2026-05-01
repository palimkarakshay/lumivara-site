type Props = {
  src: string;
  title: string;
  /** When true, hides the iframe and shows an "Open in new tab" link instead. */
  forceLink?: boolean;
};

/**
 * Iframe wrapper used by the Preview and Deployed tabs. Production responses
 * may set `X-Frame-Options: DENY`; when `forceLink` is true the consumer can
 * fall back to a plain link without losing the tab UX.
 */
export function PreviewFrame({ src, title, forceLink }: Props) {
  if (forceLink) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-canvas px-3 py-2 text-body-sm font-medium text-ink hover:bg-parchment"
      >
        Open {title} in a new tab ↗
      </a>
    );
  }
  return (
    <iframe
      title={title}
      src={src}
      sandbox="allow-scripts allow-same-origin"
      referrerPolicy="no-referrer"
      className="h-[800px] w-full rounded-md border border-border-subtle bg-canvas"
    />
  );
}
