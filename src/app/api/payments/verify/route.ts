import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyAndSettle } from "@/features/payments/settle";

/** GET /api/payments/verify?reference=dd-... : verifies with Paystack, then reports OUR status. */
export async function GET(req: Request) {
  if (!rateLimit(`verify:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const reference = new URL(req.url).searchParams.get("reference");
  if (!reference) return NextResponse.json({ error: "Missing reference." }, { status: 400 });

  try {
    const result = await verifyAndSettle(reference);
    return NextResponse.json({ status: result.status });
  } catch {
    return NextResponse.json({ error: "Couldn't verify right now." }, { status: 502 });
  }
}