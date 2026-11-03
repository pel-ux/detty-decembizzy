import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSurpriseByPublicId } from "@/features/surprise-creator/queries";
import { isOwner } from "@/features/surprise-creator/ownership";
import { CURRENCY, PRODUCTS } from "@/features/payments/pricing";
import { initializeCheckoutSchema } from "@/features/payments/schemas";
import { generatePaymentReference, initializeTransaction } from "@/features/payments/paystack";

export async function POST(req: Request) {
  if (!rateLimit(`pay:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Wait a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = initializeCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const { publicId, productCode, email } = parsed.data;

  // The amount ALWAYS comes from the server-side pricing file, never the browser.
  const product = PRODUCTS[productCode];
  if (!product.available) {
    return NextResponse.json({ error: "That option isn't available yet." }, { status: 400 });
  }

  const lookup = await getSurpriseByPublicId(publicId);
  if (lookup.status !== "found") {
    return NextResponse.json({ error: "Surprise not found." }, { status: 404 });
  }
  if (!(await isOwner(publicId, lookup.manageTokenHash))) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  if (lookup.surprise.tier === "premium") {
    return NextResponse.json({ error: "This surprise is already Premium." }, { status: 409 });
  }

  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("surprises")
    .select("id")
    .eq("public_id", publicId)
    .maybeSingle<{ id: string }>();
  if (!row) return NextResponse.json({ error: "Surprise not found." }, { status: 404 });

  const reference = generatePaymentReference();
  const { error: insertError } = await supabase.from("payments").insert({
    surprise_id: row.id,
    paystack_reference: reference,
    amount: product.amountKobo,
    currency: CURRENCY,
    product_code: product.code,
  });
  if (insertError) {
    console.error("payment insert failed", insertError.code);
    return NextResponse.json({ error: "Couldn't start payment. Please try again." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  try {
    const tx = await initializeTransaction({
      email,
      amountKobo: product.amountKobo,
      reference,
      callbackUrl: `${siteUrl}/payment/callback`,
    });
    return NextResponse.json({ authorizationUrl: tx.authorization_url });
  } catch {
    await supabase.from("payments").update({ status: "failed" }).eq("paystack_reference", reference);
    return NextResponse.json(
      { error: "Couldn't reach Paystack. Your surprise is safe. Try again in a moment." },
      { status: 502 },
    );
  }
}