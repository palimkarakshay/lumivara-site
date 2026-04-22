import { cn } from "@/lib/utils";

type NumberedSectionProps = {
  number: string;
  label: string;
  className?: string;
  as?: "div" | "p" | "span";
};

export function NumberedSection({
  number,
  label,
  className,
  as: Tag = "div",
}: NumberedSectionProps) {
  return (
    <Tag
      className={cn("text-label text-muted-strong inline-flex items-center gap-2", className)}
      aria-hidden="false"
    >
      <span className="text-accent">{number}</span>
      <span className="select-none">/</span>
      <span>{label}</span>
    </Tag>
  );
}
