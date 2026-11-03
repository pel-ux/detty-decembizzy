import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { PAYMENT_REFERENCE_PATTERN, verifyTransaction } from "./paystack";

export type PaymentStatus = "pending" | "successful" | "failed" | "abandoned";
export type SettleResult = { status: PaymentStatus | "unknown"; newlySettled: boolean };

type PaymentRow = { amount: number; currency: string; status: PaymentStatus };

/**
 * The ONLY place premium gets granted. Safe to call repeatedly, from the
 * callback page, the verify route and the webhook. Never trusts client input:
 * it re-checks with Paystack and compares status, amount, currency, reference.
 * Throws if Paystack or the database is unreachable (so the webhook can retry).
 */
export async function verifyAndSettle(reference: string, eventId?: string): Promise<SettleResult> {
  if (!PAYMENT_REFERENCE_PATTERN.test(reference)) return { status: "unknown", newlySettled: false };

  const supabase = createAdminClient();
  const { data: payment, error } = await supabase
    .from("payments")
    .select("amount, currency, status")
    .eq("paystack_reference", reference)
    .maybeSingle<PaymentRow>();

  if (error) throw new Error("Failed to load payment");
  if (!payment) return { status: "unknown", newlySettled: false };
  if (payment.status === "successful") return { status: "successful", newlySettled: false };

  const tx = await verifyTransaction(reference);
  if (tx.reference !== reference) {
    console.error("paystack reference mismatch");
    return { status: payment.status, newlySettled: false };
  }

  if (tx.status === "success") {
    if (tx.amount !== payment.amount || tx.currency !== payment.currency) {
      console.error("payment amount/currency mismatch", reference); // needs manual review
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("paystack_reference", reference)
        .neq("status", "successful");
      return { status: "failed", newlySettled: false };
    }

    const { data, error: rpcError } = await supabase.rpc("mark_payment_successful", {
      p_reference: reference,
      p_event_id: eventId ?? null,
    });
    if (rpcError) throw new Error("Failed to settle payment");
    return { status: "successful", newlySettled: data === true };
  }

  if (tx.status === "failed" || tx.status === "abandoned") {
    await supabase
      .from("payments")
      .update({ status: tx.status })
      .eq("paystack_reference", reference)
      .eq("status", "pending");
    return { status: tx.status, newlySettled: false };
  }

  return { status: "pending", newlySettled: false }; // still in progress
}

/** Read-only status from OUR database, for the success page. */
export async function getPaymentSummary(
  reference: string,
): Promise<{ status: PaymentStatus; publicId: string } | null> {
  if (!PAYMENT_REFERENCE_PATTERN.test(reference)) return null;
  const supabase = createAdminClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("status, surprise_id")
    .eq("paystack_reference", reference)
    .maybeSingle<{ status: PaymentStatus; surprise_id: string }>();
  if (!payment) return null;

  const { data: surprise } = await supabase
    .from("surprises")
    .select("public_id")
    .eq("id", payment.surprise_id)
    .maybeSingle<{ public_id: string }>();
  if (!surprise) return null;

  return { status: payment.status, publicId: surprise.public_id };
}