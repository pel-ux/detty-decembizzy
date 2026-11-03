import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Terms" };

// PLACEHOLDER: real terms are written in Phase 5.
export default function TermsPage() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-extrabold text-pine">Terms</h1>
      <p className="mt-4 max-w-2xl text-ink/75">
        Full terms of use coming before launch.
      </p>
    </Container>
  );
}