import { VIBES } from "@/features/surprise-creator/vibes";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function VibesSection() {
  return (
    <section id="styles" className="scroll-mt-16 bg-cream-deep py-20">
      <Container>
        <SectionHeading
          eyebrow="Surprise styles"
          title="Pick the vibe. Santa handles the rest."
          description="Five tones, all friendly. Santa roasts with love and never gets cruel."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIBES.map((vibe) => (
            <li key={vibe.id} className="rounded-2xl bg-cream p-6 shadow-sm ring-1 ring-pine/10">
              <p className="text-3xl" aria-hidden>{vibe.emoji}</p>
              <h3 className="mt-3 text-xl font-bold text-pine">{vibe.label}</h3>
              <p className="mt-1 text-sm font-semibold text-santa">{vibe.blurb}</p>
              <p className="mt-3 italic leading-relaxed text-ink/75">&ldquo;{vibe.sample}&rdquo;</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}