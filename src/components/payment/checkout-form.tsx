"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS, formatNaira } from "@/features/payments/pricing";

export function CheckoutForm({ publicId }: { publicId: string }) {
  const product = PRODUCTS.premium_surprise;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, productCode: product.code, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setPending(false);
        return;
      }
      window.location.href = data.authorizationUrl; // Paystack-hosted checkout
    } catch {
      setError("Network issue. Check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border-2 border-gold bg-white p-5" noValidate>
      <h2 className="text-lg font-bold text-pine">
        Unlock {product.name}: {formatNaira(product.amountKobo)}
      </h2>
      <p className="mt-1 text-sm text-ink/70">One payment for this surprise. You get:</p>
      <ul className="mt-3 space-y-2 text-sm">
        {product.features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-pine" />
            {f}
          </li>
        ))}
      </ul>

      <label htmlFor="email" className="mt-4 block text-sm font-semibold text-pine">
        Email for your Paystack receipt
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="mt-1 w-full rounded-xl border-2 border-pine/20 px-4 py-3 text-base focus:border-pine focus:outline-none"
      />
      <p className="mt-1 text-xs text-ink/60">Paystack needs it to take payment. We don&apos;t keep it.</p>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-santa/10 p-3 text-sm font-semibold text-santa-dark">
          {error}
        </p>
      )}

      <Button type="submit" variant="gold" disabled={pending} className="mt-4 w-full">
        {pending && <Loader2 aria-hidden className="h-5 w-5 animate-spin" />}
        {pending ? "Opening Paystack..." : `Pay ${formatNaira(product.amountKobo)} with Paystack`}
      </Button>
      <p className="mt-2 text-center text-xs text-ink/60">
        If payment fails, your surprise stays exactly as it is.
      </p>
    </form>
  );
}