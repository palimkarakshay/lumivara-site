export function CarbonBadge() {
  return (
    <a
      href="https://www.websitecarbon.com/website/lumivara-ca/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-caption text-accent transition-colors hover:bg-accent/20"
      title="This website was built with a focus on sustainability and minimal carbon footprint"
    >
      <span aria-hidden>♻️</span>
      <span>Built carbon-lean</span>
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}
