import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { CURRENCY } from "./pricing";
import { paystackInitSchema, paystackVerifySchema } from "./schemas";

const BASE_URL = "https://api.paystack.co";

// Paystack references allow letters, digits, "-", "." and "=". No underscores.
export const generatePaymentReference = () => `dd-${randomBytes(12).toString("hex")}`;
export const PAYMENT_REFERENCE_PATTERN = /^dd-[a-f0-9]{24}$/;

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export async function initializeTransaction(params: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
}) {
  const res = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      currency: CURRENCY,
      reference: params.reference,
      callback_url: params.callbackUrl,
    }),
    cache: "no-store",
  });
  const parsed = paystackInitSchema.safeParse(await res.json().catch(() => null));
  if (!res.ok || !parsed.success || !parsed.data.status) throw new Error("Paystack initialize failed");
  return parsed.data.data;
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
    cache: "no-store",
  });
  const parsed = paystackVerifySchema.safeParse(await res.json().catch(() => null));
  if (!res.ok || !parsed.success) throw new Error("Paystack verify failed");
  return parsed.data.data;
}

/** HMAC-SHA512 of the RAW body, keyed with the secret key, hex-encoded. */
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}