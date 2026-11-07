"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, MessageCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/features/payments/pricing";
import type { OwnerItem } from "@/features/wishlists/types";
import { copyLink, openWhatsApp } from "@/components/surprise/share";
import { firstError } from "./first-error";

type Props = { publicId: string; title: string; items: OwnerItem[]; maxItems: number };

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-pine/20 bg-white px-3 py-2 text-base focus:border-pine focus:outline-none";

export function OwnerPanel({ publicId, title, items, maxItems }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const sharePath = `/wishlist/${publicId}`;
  const full = items.length >= maxItems;

  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const text = (key: string) => String(fd.get(key) ?? "");

    const priceText = text("price").trim();
    const priceNaira = priceText === "" ? undefined : Number(priceText);
    if (priceNaira !== undefined && !Number.isInteger(priceNaira)) {
      setError("Price must be a whole number of naira.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/wishlists/${publicId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: text("name"), note: text("note"), link: text("link"), priceNaira }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(firstError(data));
      } else {
        form.reset();
        router.refresh();
      }
    } catch {
      setError("Network issue. Try again.");
    }
    setPending(false);
  }

  async function removeItem(itemId: string) {
    setError(null);
    try {
      const res = await fetch(`/api/wishlists/${publicId}/items`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      if (!res.ok) setError(firstError(await res.json()));
      else router.refresh();
    } catch {
      setError("Network issue. Try again.");
    }
  }

  async function onCopy() {
    const ok = await copyLink(sharePath);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border-2 border-gold bg-white p-5">
        <h2 className="text-lg font-bold text-pine">Share your list</h2>
        <p className="mt-1 text-sm text-ink/70">
          Friends and family pick gifts from it, so nobody doubles up. You won&apos;t see who picked what. That&apos;s the surprise.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => openWhatsApp(`This is my Christmas wishlist 🎁 Pick something for me:`, sharePath)}>
            <MessageCircle aria-hidden className="h-5 w-5" /> Share on WhatsApp
          </Button>
          <Button variant="ghost" className="border-2 border-pine/30" onClick={onCopy}>
            {copied ? <Check aria-hidden className="h-5 w-5" /> : <Copy aria-hidden className="h-5 w-5" />}
            {copied ? "Link copied" : "Copy link"}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-pine">
          {title} <span className="font-normal text-ink/60">({items.length}/{maxItems})</span>
        </h2>
        {items.length === 0 ? (
          <p className="mt-3 text-ink/70">Nothing here yet. Add your first gift below.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-pine/10">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {item.priceNaira !== null && (
                    <p className="text-sm text-pine">{formatNaira(item.priceNaira * 100)}</p>
                  )}
                  {item.note && <p className="mt-1 text-sm text-ink/70">{item.note}</p>}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-1 inline-block text-sm font-semibold text-santa underline"
                    >
                      View item
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="rounded-md p-2 text-ink/50 hover:bg-santa/10 hover:text-santa"
                >
                  <Trash2 aria-hidden className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form onSubmit={addItem} className="space-y-4 rounded-2xl bg-cream-deep p-5" noValidate>
        <h2 className="text-lg font-bold text-pine">Add a gift</h2>
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-pine">What do you want?</label>
          <input id="name" name="name" required maxLength={80} autoComplete="off" className={inputClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="text-sm font-semibold text-pine">Price in naira (optional)</label>
            <input id="price" name="price" type="number" inputMode="numeric" min={0} className={inputClass} />
          </div>
          <div>
            <label htmlFor="link" className="text-sm font-semibold text-pine">Link (optional)</label>
            <input id="link" name="link" type="url" placeholder="https://" maxLength={300} className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="note" className="text-sm font-semibold text-pine">Note (optional)</label>
          <input id="note" name="note" maxLength={160} placeholder="Size, colour, where to find it" className={inputClass} />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-santa/10 p-3 text-sm font-semibold text-santa-dark">
            {error}
          </p>
        )}
        <Button type="submit" disabled={pending || full} className="w-full">
          {pending ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Plus aria-hidden className="h-5 w-5" />}
          {full ? "List is full" : "Add to my list"}
        </Button>
      </form>
    </div>
  );
}