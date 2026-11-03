import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyAndSettle } from "@/features/payments/settle";

export const metadata: Metadata = { title: "Confirming payment", robots: { index: false } };

/**
 * Paystack sends the buyer here. The query string proves nothing: we only use
 * it to know WHICH payment to verify with Paystack, then show what our DB says.
 */
export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const sp = await searchParams;
  const reference = sp.reference ?? sp.trxref;
  if (!reference) redirect("/");

  try {
    await verifyAndSettle(reference);
  } catch {
    // Paystack unreachable: the webhook will still settle it. Success page shows "confirming".
  }
  redirect(`/payment/success?reference=${encodeURIComponent(reference)}`);
}