"use client";

import { useState } from "react";
import { Gift, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { SurpriseCard, type SurpriseCardProps } from "./surprise-card";
import { openWhatsApp } from "./share";

const CONFETTI_COLORS = ["#c41e3a", "#e4b04a", "#0f4c3a", "#fff7e8"];

/** Premium-only. Deterministic values (no randomness) so renders stay pure. */
function Confetti() {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${(i * 37) % 100}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i % 7) * 0.12}s`,
            animationDuration: `${2.4 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Reveal(props: SurpriseCardProps) {
  const [opened, setOpened] = useState(false);

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] items-center bg-pine-dark px-5 py-12 text-cream">
      <div className="mx-auto w-full max-w-md text-center">
        {!opened ? (
          <>
            <p className="font-semibold text-gold">🎅🏾 Santa has a delivery</p>
            <h1 className="mt-3 text-3xl font-extrabold">{props.recipientName}, this one is for you.</h1>
            <button
              type="button"
              onClick={() => setOpened(true)}
              className="mx-auto mt-10 flex flex-col items-center gap-3 rounded-3xl bg-santa px-10 py-8 text-xl font-bold text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <Gift aria-hidden className="h-14 w-14" />
              Tap to open
            </button>
          </>
        ) : (
          <div className="animate-pop-in">
            {props.premium && <Confetti />}
            <SurpriseCard {...props} />
            <div className="mt-8 flex flex-col gap-3">
              <ButtonLink href={ROUTES.create}>Create your own surprise</ButtonLink>
              <Button
                variant="gold"
                onClick={() => openWhatsApp("Santa just sent me something 😭 Make yours:", ROUTES.create)}
              >
                <MessageCircle aria-hidden className="h-5 w-5" /> Share on WhatsApp
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}