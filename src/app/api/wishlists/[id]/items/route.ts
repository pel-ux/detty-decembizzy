import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isOwner } from "@/features/surprise-creator/ownership";
import { getWishlistByPublicId, type WishlistLookup } from "@/features/wishlists/queries";
import { MAX_ITEMS_PER_WISHLIST, addItemSchema, removeItemSchema } from "@/features/wishlists/schemas";

type Found = Extract<WishlistLookup, { status: "found" }>;
type Auth = { ok: true; lookup: Found } | { ok: false; response: NextResponse };

async function requireOwner(id: string): Promise<Auth> {
  const lookup = await getWishlistByPublicId(id);
  if (lookup.status !== "found") {
    return { ok: false, response: NextResponse.json({ error: "Wishlist not found." }, { status: 404 }) };
  }
  if (!(await isOwner(id, lookup.manageTokenHash))) {
    return { ok: false, response: NextResponse.json({ error: "Not allowed." }, { status: 403 }) };
  }
  return { ok: true, lookup };
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!rateLimit(`wl-item:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const auth = await requireOwner(id);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = addItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the item details.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  if (auth.lookup.items.length >= MAX_ITEMS_PER_WISHLIST) {
    return NextResponse.json({ error: `A list can have up to ${MAX_ITEMS_PER_WISHLIST} gifts.` }, { status: 400 });
  }

  const { name, note, priceNaira, link } = parsed.data;
  const { error } = await createAdminClient().from("wishlist_items").insert({
    wishlist_id: auth.lookup.wishlist.internalId,
    name,
    note: note ?? null,
    price_naira: priceNaira ?? null,
    link: link ?? null,
  });
  if (error) {
    console.error("wishlist item insert failed", error.code);
    return NextResponse.json({ error: "Couldn't add that gift. Try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!rateLimit(`wl-del:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const auth = await requireOwner(id);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = removeItemSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { error } = await createAdminClient()
    .from("wishlist_items")
    .delete()
    .eq("id", parsed.data.itemId)
    .eq("wishlist_id", auth.lookup.wishlist.internalId);
  if (error) {
    console.error("wishlist item delete failed", error.code);
    return NextResponse.json({ error: "Couldn't remove that gift." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}