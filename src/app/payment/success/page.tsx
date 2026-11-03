import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getPaymentSummary } from "@/features/payments/settle";

export const metadata: Metadata = { title: "Payment status", robots: { index: false } };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  const summary = reference ? await getPaymentSummary(reference) : null;
  if (!summary) notFound();

  const back = `/preview/${summary.publicId}`;
  const copy = {
    successful: {
      title: "Premium unlocked ✦",
      text: "Your surprise now has the gold card, the confetti reveal and more variations.",
      cta: "Back to my surprise",
    },
    pending: {
      title: "Still confirming your payment",
      text: "This can take a minute. Refresh shortly. If you were charged, Premium will unlock automatically.",
      cta: "Back to my surprise",
    },
    failed: {
      title: "Payment didn't go through",
      text: "You haven't been charged for this attempt, and your surprise is safe. You can try again.",
      cta: "Back to my surprise",
    },
    abandoned: {
      title: "Payment was cancelled",
      text: "No problem. Your surprise is safe and you can upgrade any time.",
      cta: "Back to my surprise",
    },
  }[summary.status];

  return (
    <Container className="max-w-lg py-20 text-center">
      <h1 className="text-3xl font-extrabold text-pine">{copy.title}</h1>
      <p className="mt-3 text-ink/75">{copy.text}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href={back}>{copy.cta}</ButtonLink>
        {summary.status === "pending" && (
          <ButtonLink href={`/payment/success?reference=${encodeURIComponent(reference ?? "")}`} variant="ghost" className="border-2 border-pine/30">
            Refresh status
          </ButtonLink>
        )}
      </div>
    </Container>
  );
}