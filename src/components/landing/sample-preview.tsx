import { Sparkles } from "lucide-react";

/** Static sample only. The real card is built in Phase 2. */
export function SamplePreview() {
  return (
    <figure
      aria-label="Sample Christmas surprise"
      className="relative mx-auto w-full max-w-sm -rotate-2 rounded-3xl border-4 border-gold bg-cream p-6 text-ink shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-santa px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Savage
        </span>
        <Sparkles aria-hidden className="h-5 w-5 text-gold animate-twinkle" />
      </div>
      <p className="mt-6 text-sm font-semibold text-pine">For Tolu 🎅🏾</p>
      <blockquote className="mt-2 font-display text-xl font-bold leading-snug">
        &ldquo;Tolu, Santa reviewed your year. The report is not looking good. But because
        Christmas is involved, we go manage you.&rdquo;
      </blockquote>
      <figcaption className="mt-6 border-t border-dashed border-pine/30 pt-4 text-sm text-ink/70">
        From: Someone who knows you too well
      </figcaption>
    </figure>
  );
}