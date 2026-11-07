import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PreviewPanel } from "@/components/surprise/preview-panel";
import { getSurpriseByPublicId } from "@/features/surprise-creator/queries";
import { isOwner } from "@/features/surprise-creator/ownership";
import { REGEN_LIMITS } from "@/features/payments/pricing";

export const metadata: Metadata = { title: "Preview your surprise", robots: { index: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lookup = await getSurpriseByPublicId(id);
  if (lookup.status !== "found") notFound();

  // Only the creator's browser sees the controls; everyone else gets the reveal page.
  if (!(await isOwner(id, lookup.manageTokenHash))) redirect(`/surprise/${id}`);

  const s = lookup.surprise;
  return (
    <Container className="max-w-md py-10">
      <h1 className="text-2xl font-extrabold text-pine">Your preview</h1>
      <p className="mt-1 mb-6 text-sm text-ink/70">
        Only you see these controls. People with your link get the reveal experience.
      </p>
      <PreviewPanel
        publicId={s.publicId}
        remainingRegens={Math.max(0, REGEN_LIMITS[s.tier] - s.regenCount)}
        recipientName={s.recipientName}
        message={s.generatedMessage}
        vibe={s.vibe}
        senderName={s.senderName}
        customMessage={s.customMessage}
        premium={s.tier === "premium"}
      />
    </Container>
  );
}