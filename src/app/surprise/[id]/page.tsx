import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/surrprise/reveal";
import { getSurpriseByPublicId } from "@/features/surprise-creator/queries";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "A surprise from Santa", robots: { index: false } };

export default async function SurprisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lookup = await getSurpriseByPublicId(id);

  if (lookup.status === "not_found") notFound();

  if (lookup.status === "expired") {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-3xl font-extrabold text-pine">This surprise has expired</h1>
        <p className="mt-3 text-ink/70">Santa has packed it away. Make a fresh one.</p>
        <ButtonLink href={ROUTES.create} className="mt-8">Create a Christmas Surprise</ButtonLink>
      </Container>
    );
  }

  const s = lookup.surprise;
  return (
    <Reveal
      recipientName={s.recipientName}
      message={s.generatedMessage}
      vibe={s.vibe}
      senderName={s.senderName}
      customMessage={s.customMessage}
      premium={s.tier === "premium"}
    />
  );
}