import { BRAND, ROUTES } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SamplePreview } from "./sample-preview";

export function Hero() {
  return (
    <section className="bg-pine-dark text-cream">
      <Container className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 inline-block rounded-full border border-gold/50 px-4 py-1 text-sm font-semibold text-gold">
            🎄 Detty December, but make it personal
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Santa has something to tell <span className="text-gold">somebody</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
            Make a funny, personalised Christmas surprise from Nigerian Santa. Preview it free,
            then send it to your friend, crush, sibling or group chat with one link.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={ROUTES.create}>Create a Christmas Surprise</ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary">
              See How It Works
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-cream/60">{BRAND.tagline}</p>
        </div>
        <SamplePreview />
      </Container>
    </section>
  );
}