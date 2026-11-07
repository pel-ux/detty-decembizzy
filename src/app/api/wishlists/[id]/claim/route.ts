import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isOwner } from "@/features/surprise-creator/ownership";
import { getWishlistByPublicId } from "@/features/wishlists/queries";
import { claimSchema } from "@/features/wishlists/schemas";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!rateLimit(`wl-claim:${clientIp(req)}`, 15, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Wait a minute." }, { status: 429 });
  }

  const lookup = await getWishlistByPublicId(id);
  if (lookup.status !== "found") {
    return NextResponse.json({ error: "Wishlist not found." }, { status: 404 });
  }
  // The list owner must not be able to peek at or make claims on their own list.
  if (await isOwner(id, lookup.manageTokenHash)) {
    return NextResponse.json({ error: "This is your own list. Claims stay hidden from you." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your details.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Atomic: only succeeds if the item is still unclaimed, so two people can't both win.
  const { data, error } = await createAdminClient()
    .from("wishlist_items")
    .update({ claimed_by: parsed.data.nickname, claimed_at: new Date().toISOString() })
    .eq("id", parsed.data.itemId)
    .eq("wishlist_id", lookup.wishlist.internalId)
    .is("claimed_by", null)
    .select("id");

  if (error) {
    console.error("wishlist claim failed", error.code);
    return NextResponse.json({ error: "Couldn't save that. Try again." }, { status: 500 });
  }
  if (!data?.length) {
    return NextResponse.json({ error: "Someone just picked that one. Choose another." }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}