"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { firstError } from "./first-error";

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-pine/20 bg-white px-4 py-3 text-base focus:border-pine focus:outline-none";

export function CreateWishlistForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/wishlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: String(fd.get("ownerName") ?? ""),
          title: String(fd.get("title") ?? ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(firstError(data));
        setPending(false);
        return;
      }
      router.push(`/wishlist/${data.publicId}`);
    } catch {
      setError("Network issue. Check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="ownerName" className="font-semibold text-pine">Your name</label>
        <input id="ownerName" name="ownerName" required maxLength={40} autoComplete="given-name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="title" className="font-semibold text-pine">Name your list</label>
        <input
          id="title"
          name="title"
          required
          maxLength={60}
          placeholder="e.g. Tolu's Christmas Wishlist"
          autoComplete="off"
          className={inputClass}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-santa/10 p-3 text-sm font-semibold text-santa-dark">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Loader2 aria-hidden className="h-5 w-5 animate-spin" />}
        {pending ? "Creating..." : "Create my wishlist"}
      </Button>
    </form>
  );
}