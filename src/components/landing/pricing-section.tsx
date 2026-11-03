import { Check } from "lucide-react";
import { PRODUCTS, REGEN_LIMITS, formatNaira } from "@/features/payments/pricing";
import { ROUTES } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const FREE_FEATURES = [
  "One Santa surprise with a shareable link",
  "All five message vibes",
  "Classic festive card",
  `${REGEN_LIMITS.free} free message variations`,
] as const;

export function PricingSection() {
  const premium = PRODUCTS.premium_surprise;
  const bundle = PRODUCTS.premium_bundle;

  return (
    <section id="pricing" className="scroll-mt-16 py-20">
      <Container>
        <SectionHeading
          eyebrow="Free vs Premium"
          title="Start free. Upgrade only if you want to."
          description="You always preview your surprise before paying, and you'll see exactly what you get at checkout."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <PlanCard name="Free" price="₦0" summary="Everything you need to send a proper surprise." features={FREE_FEATURES} cta="Start free" />
          <PlanCard
            name={premium.name}
            price={formatNaira(premium.amountKobo)}
            summary={premium.summary}
            features={premium.features}
            cta="Create, then upgrade"
            highlight
          />
          <PlanCard
            name={bundle.name}
            price={formatNaira(bundle.amountKobo)}
            summary={bundle.summary}
            features={bundle.features}
            cta="Create, then upgrade"
            comingSoon={!bundle.available}
          />
        </div>
      </Container>
    </section>
  );
}

type PlanProps = {
  name: string;
  price: string;
  summary: string;
  features: readonly string[];
  cta: string;
  highlight?: boolean;
  comingSoon?: boolean;
};

function PlanCard({ name, price, summary, features, cta, highlight, comingSoon }: PlanProps) {
  return (
    <div
      className={
        highlight
          ? "flex flex-col rounded-3xl bg-pine p-7 text-cream ring-4 ring-gold"
          : "flex flex-col rounded-3xl bg-white/70 p-7 ring-1 ring-pine/15"
      }
    >
      <h3 className="text-xl font-bold">{name}</h3>
      <p className={highlight ? "mt-2 text-4xl font-extrabold text-gold" : "mt-2 text-4xl font-extrabold text-pine"}>
        {price}
      </p>
      <p className={highlight ? "mt-2 text-cream/80" : "mt-2 text-ink/70"}>{summary}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex gap-3">
            <Check aria-hidden className={highlight ? "mt-0.5 h-5 w-5 shrink-0 text-gold" : "mt-0.5 h-5 w-5 shrink-0 text-pine"} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {comingSoon ? (
        <p className="mt-8 rounded-full border-2 border-pine/20 px-6 py-3 text-center font-semibold text-ink/60">
          Coming soon
        </p>
      ) : (
        <ButtonLink href={ROUTES.create} variant={highlight ? "gold" : "primary"} className="mt-8">
          {cta}
        </ButtonLink>
      )}
    </div>
  );
}