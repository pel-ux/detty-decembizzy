import { NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/features/payments/paystack";
import { webhookEventSchema } from "@/features/payments/schemas";
import { verifyAndSettle } from "@/features/payments/settle";

export async function POST(req: Request) {
  // Must be the RAW body: re-serialised JSON would not match the signature.
  const rawBody = await req.text();

  if (!isValidWebhookSignature(rawBody, req.headers.get("x-paystack-signature"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Bad payload", { status: 400 });
  }
  const parsed = webhookEventSchema.safeParse(json);
  if (!parsed.success) return new NextResponse("Bad payload", { status: 400 });

  const { event, data } = parsed.data;
  // Acknowledge events we don't act on so Paystack doesn't keep retrying them.
  if (event !== "charge.success" || !data.reference) return NextResponse.json({ received: true });

  try {
    // The event body is NOT trusted: verifyAndSettle re-checks with Paystack,
    // and is idempotent, so duplicate deliveries are safe.
    await verifyAndSettle(data.reference, data.id !== undefined ? String(data.id) : undefined);
    return NextResponse.json({ received: true });
  } catch {
    console.error("webhook processing failed");
    return new NextResponse("Retry later", { status: 500 }); // Paystack will retry
  }
}