"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatNaira } from "@/features/payments/pricing";
import type { GiverItem } from "@/features/wishlists/types";
import { ROUTES } from "@/lib/constants";
import { firstError } from "./first-error";

type Props = { publicId: string; ownerName: string; title: string; items: GiverItem[] };

export function GiverPanel({ publicId, ownerName, title, items }: Props) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function claim(itemId: string) {
    if (nickname.trim() === "") {
      setError("Add your name first, so other givers know it's taken.");
      return;
    }
    setBusyId(itemId);
    setError(null);
    try {
      const res = await fetch(`/api/wishlists/${publicId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, nickname }),
      });
      const data = await res.json();
      if (!res.ok) setError(firstError(data));
      router.refresh(); // show the latest state either way
    } catch {
      setError("Network issue. Try again.");
    }
    setBusyId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-santa">🎅🏾 Secret wishlist</p>
        <h1 className="mt-1 text-3xl font-extrabold text-pine">{title}</h1>
        <p className="mt-2 text-ink/70">
          {ownerName} made this list. Pick something and it&apos;s marked as taken for other givers.
          {ownerName} won&apos;t see who picked what.
        </p>
      </div>

      <div>
        <label htmlFor="nickname" className="font-semibold text-pine">Your name</label>
        <input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={30}
          autoComplete="given-name"
          placeholder="Other givers will see this"
          className="mt-1 w-full rounded-xl border-2 border-pine/20 bg-white px-4 py-3 text-base focus:border-pine focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-santa/10 p-3 text-sm font-semibold text-santa-dark">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-ink/70">{ownerName} hasn&apos;t added any gifts yet. Check back soon.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl bg-white p-4 ring-1 ring-pine/10">
              <p className="font-semibold">{item.name}</p>
              {item.priceNaira !== null && <p className="text-sm text-pine">{formatNaira(item.priceNaira * 100)}</p>}
              {item.note && <p className="mt-1 text-sm text-ink/70">{item.note}</p>}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-1 inline-block text-sm font-semibold text-santa underline"
                >
                  View item (opens another site)
                </a>
              )}
              <div className="mt-3">
                {item.claimedBy ? (
                  <p className="rounded-full bg-pine/10 px-4 py-2 text-center text-sm font-semibold text-pine">
                    Taken by {item.claimedBy}
                  </p>
                ) : (
                  <Button className="w-full" disabled={busyId === item.id} onClick={() => claim(item.id)}>
                    <Gift aria-hidden className="h-5 w-5" /> I&apos;ll get this
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-3 rounded-2xl bg-pine p-5 text-cream">
        <p className="font-bold">Make the gift unforgettable</p>
        <p className="text-sm text-cream/80">Attach a funny Santa surprise to what you&apos;re giving.</p>
        <ButtonLink href={ROUTES.create} variant="gold" className="w-full">
          Add a Santa surprise
        </ButtonLink>
        <ButtonLink href={ROUTES.wishlistNew} variant="secondary" className="w-full">
          Make your own wishlist
        </ButtonLink>
      </div>
    </div>
  );
}