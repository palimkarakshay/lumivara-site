"use client";

import { cn } from "@/lib/utils";

export type EditorTabKey = "existing" | "draft" | "preview" | "deployed";

type Tab = {
  key: EditorTabKey;
  label: string;
  glyph: string;
};

const TABS: readonly Tab[] = [
  { key: "existing", label: "Existing", glyph: "◐" },
  { key: "draft", label: "Draft", glyph: "✎" },
  { key: "preview", label: "Preview", glyph: "▢" },
  { key: "deployed", label: "Deployed", glyph: "▲" },
];

type Props = {
  active: EditorTabKey;
  onChange: (next: EditorTabKey) => void;
};

export function EditorTabs({ active, onChange }: Props) {
  return (
    <div role="tablist" aria-label="Editor view" className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`editor-panel-${tab.key}`}
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-body-sm font-medium",
              isActive
                ? "border-accent bg-canvas text-ink ring-1 ring-accent"
                : "border-border-subtle bg-canvas text-ink-soft hover:bg-parchment hover:text-ink",
            )}
          >
            <span aria-hidden>{tab.glyph}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
