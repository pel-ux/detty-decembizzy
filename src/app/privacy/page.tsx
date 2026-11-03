import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Privacy" };

// PLACEHOLDER: real policy is written in Phase 5, ideally reviewed by a lawyer.
export default function PrivacyPage() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-extrabold text-pine">Privacy</h1>
      <p className="mt-4 max-w-2xl text-ink/75">
        Full privacy policy coming before launch.
      </p>
    </Container>
  );
}