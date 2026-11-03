"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { CheckoutForm } from "@/components/payment/checkout-form";
import { ROUTES } from "@/lib/constants";
import { SurpriseCard, type SurpriseCardProps } from "./surprise-card";
import { copyLink, openWhatsApp } from "./share";

type Props = SurpriseCardProps & { publicId: string; remainingRegens: number };

export function PreviewPanel({ publicId, remainingRegens, message: initialMessage, ...card }: Props) {
  const [message, setMessage] = useState(initialMessage);
  const [remaining, setRemaining] = useState(remainingRegens);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const sharePath = `/surprise/${publicId}`;
  const outline = "border-2 border-pine/30";

  async function regenerate() {
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/surprises/${publicId}/regenerate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error ?? "Couldn't generate another one.");
      } else {
        setMessage(data.message);
        setRemaining(data.remaining);
      }
    } catch {
      setNotice("Network issue. Try again.");
    }
    setBusy(false);
  }

  async function onCopy() {
    const ok = await copyLink(sharePath);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <SurpriseCard {...card} message={message} />

      <div className="mt-6 space-y-3">
        <Button variant="ghost" className={`w-full ${outline}`} onClick={regenerate} disabled={busy || remaining <= 0}>
          <RefreshCw aria-hidden className={`h-5 w-5 ${busy ? "animate-spin" : ""}`} />
          {remaining > 0 ? `Try another variation (${remaining} left)` : "No variations left"}
        </Button>
        <p role="status" className="text-center text-sm font-semibold text-santa">
          {notice}
        </p>

        <Button className="w-full" onClick={() => openWhatsApp(`Santa has a message for ${card.recipientName} 🎅🏾 Open it:`, sharePath)}>
          <MessageCircle aria-hidden className="h-5 w-5" /> Share on WhatsApp
        </Button>
        <Button variant="ghost" className={`w-full ${outline}`} onClick={onCopy}>
          {copied ? <Check aria-hidden className="h-5 w-5" /> : <Copy aria-hidden className="h-5 w-5" />}
          {copied ? "Link copied" : "Copy link"}
        </Button>

        {card.premium ? (
          <p className="rounded-2xl bg-gold/20 p-4 text-center font-semibold text-pine">
            Premium unlocked ✦ Your recipient gets the confetti reveal.
          </p>
        ) : (
          <CheckoutForm publicId={publicId} />
        )}

        <ButtonLink href={ROUTES.create} variant="ghost" className="w-full">
          Start over
        </ButtonLink>
      </div>
    </div>
  );
}