/**
 * Single source of truth for pricing and tier limits.
 * Amounts are in kobo (Paystack's subunit): 50_000 kobo = ₦500.
 * Prices are TEST HYPOTHESES (₦300 / ₦500 / ₦1,000). Change them here only.
 * The server looks up the amount by product code and never trusts the browser.
 */
export const CURRENCY = "NGN" as const;

/** Free message variations vs Premium. Enforced server-side. */
export const REGEN_LIMITS = { free: 3, premium: 10 } as const;

export const PRODUCTS = {
  premium_surprise: {
    code: "premium_surprise",
    name: "Premium Surprise",
    amountKobo: 50_000,
    available: true,
    summary: "Upgrade one surprise with the gold card and a confetti reveal.",
    features: [
      "Gold premium card design",
      "Confetti reveal when they open it",
      `Up to ${REGEN_LIMITS.premium} message variations (instead of ${REGEN_LIMITS.free})`,
    ],
  },
  premium_bundle: {
    code: "premium_bundle",
    name: "Bundle of 3",
    amountKobo: 100_000,
    available: false, // needs a credits model, not built yet
    summary: "Premium for three surprises. Everyone on your list sorted.",
    features: [
      "Everything in Premium Surprise",
      "Use it on 3 different surprises",
      "Best for group chats and family",
    ],
  },
} as const;

export type ProductCode = keyof typeof PRODUCTS;

export function formatNaira(amountKobo: number): string {
  const naira = amountKobo / 100;
  return `₦${naira.toLocaleString("en-NG")}`;
}