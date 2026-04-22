import { siteConfig } from "@/lib/site-config";

export function CredentialsStrip() {
  const items = [...siteConfig.credentials, "Based in Toronto"];
  return (
    <div className="w-full border-y border-border-subtle bg-canvas-elevated">
      <div className="mx-auto max-w-[1280px] px-6 py-5 sm:px-8">
        <ul className="text-label text-muted-strong flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {items.map((c, i) => (
            <li key={c} className="flex items-center gap-4">
              <span>{c}</span>
              {i < items.length - 1 && (
                <span aria-hidden className="text-accent">·</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
