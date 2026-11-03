import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, tone = "light", className }: Props) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className={cn("mb-3 text-sm font-bold uppercase tracking-widest", dark ? "text-gold" : "text-santa")}>
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-3xl font-extrabold sm:text-4xl", dark ? "text-cream" : "text-pine")}>
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-cream/80" : "text-ink/75")}>
          {description}
        </p>
      )}
    </div>
  );
}