"use client";

import { useState, type ReactNode } from "react";

import { EditorTabs, type EditorTabKey } from "./EditorTabs";

type Props = {
  slug: string;
  panels: Record<EditorTabKey, ReactNode>;
};

export function EditorShell({ panels }: Props) {
  const [active, setActive] = useState<EditorTabKey>("draft");
  return (
    <div className="flex flex-col gap-6">
      <EditorTabs active={active} onChange={setActive} />
      {(["existing", "draft", "preview", "deployed"] as const).map((key) => (
        <section
          key={key}
          id={`editor-panel-${key}`}
          role="tabpanel"
          aria-labelledby={`editor-tab-${key}`}
          hidden={active !== key}
          className="flex flex-col gap-4"
        >
          {panels[key]}
        </section>
      ))}
    </div>
  );
}
