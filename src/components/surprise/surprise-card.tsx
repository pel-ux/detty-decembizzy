import { Sparkles } from "lucide-react";
import { VIBES, type VibeId } from "@/features/surprise-creator/vibes";

export type SurpriseCardProps = {
  recipientName: string;
  message: string;
  vibe: VibeId;
  senderName?: string | null;
  customMessage?: string | null;
  premium?: boolean;
};

/** All text is rendered as React text nodes (auto-escaped); never use dangerouslySetInnerHTML here. */
export function SurpriseCard({ recipientName, message, vibe, senderName, customMessage, premium }: SurpriseCardProps) {
  const vibeLabel = VIBES.find((v) => v.id === vibe)?.label ?? "";

  return (
    <article
      className={
        premium
          ? "rounded-3xl border-4 border-gold bg-gradient-to-br from-cream via-white to-cream-deep p-6 text-left text-ink shadow-2xl ring-4 ring-gold/50"
          : "rounded-3xl border-4 border-gold bg-cream p-6 text-left text-ink shadow-2xl"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-santa px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {vibeLabel}
          </span>
          {premium && (
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
              Premium ✦
            </span>
          )}
        </div>
        <Sparkles aria-hidden className="h-5 w-5 text-gold animate-twinkle" />
      </div>
      <p className="mt-6 text-sm font-semibold text-pine">For {recipientName} 🎅🏾</p>
      <p className="mt-2 font-display text-xl font-bold leading-snug">{message}</p>
      {customMessage && (
        <div className="mt-5 rounded-xl bg-cream-deep p-4 text-sm leading-relaxed">
          <p className="font-semibold text-pine">A personal note</p>
          <p className="mt-1 whitespace-pre-line">{customMessage}</p>
        </div>
      )}
      <p className="mt-6 border-t border-dashed border-pine/30 pt-4 text-sm text-ink/70">
        From: {senderName || "Someone who knows you"}
      </p>
    </article>
  );
}