import { homeContent } from "@/content/home";

export function ComingSoonProof() {
  const { comingSoonProof } = homeContent;
  return (
    <section
      aria-label="Client engagements"
      className="w-full bg-parchment px-6 py-14 sm:px-8 sm:py-16"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 text-center">
        <p className="text-label text-muted-strong">{comingSoonProof.label}</p>
        <p className="text-body-sm text-ink-soft max-w-[520px]">
          {comingSoonProof.body}
        </p>
        <ul
          className="grid w-full max-w-[900px] grid-cols-2 gap-4 sm:grid-cols-5"
          aria-hidden
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <li
              key={i}
              className="flex h-14 items-center justify-center rounded-sm border border-dashed border-border-subtle text-label text-muted-strong/60"
            >
              Client {i + 1}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
