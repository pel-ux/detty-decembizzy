import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { VibesSection } from "@/components/landing/vibes-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <VibesSection />
      <PricingSection />
      <Faq />
      <FinalCta />
    </>
  );
}