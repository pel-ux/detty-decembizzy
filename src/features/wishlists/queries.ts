import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { GiverItem } from "./types";

const PUBLIC_ID_PATTERN = /^[A-Za-z0-9_-]{12}$/;

type WishlistRow = {
  id: string;
  public_id: string;
  owner_name: string;
  title: string;
  manage_token_hash: string;
  expires_at: string | null;
};

type ItemRow = {
  id: string;
  name: string;
  note: string | null;
  price_naira: number | null;
  link: string | null;
  claimed_by: string | null;
};

export type WishlistLookup =
  | {
      status: "found";
      wishlist: { internalId: string; publicId: string; ownerName: string; title: string };
      /** Includes claim data. Pages must strip it before rendering the owner view. */
      items: GiverItem[];
      manageTokenHash: string;
    }
  | { status: "expired" }
  | { status: "not_found" };

export async function getWishlistByPublicId(publicId: string): Promise<WishlistLookup> {
  if (!PUBLIC_ID_PATTERN.test(publicId)) return { status: "not_found" };
  const supabase = createAdminClient();

  const { data: row, error } = await supabase
    .from("wishlists")
    .select("id, public_id, owner_name, title, manage_token_hash, expires_at")
    .eq("public_id", publicId)
    .maybeSingle<WishlistRow>();

  if (error) throw new Error("Failed to load wishlist");
  if (!row) return { status: "not_found" };
  if (row.expires_at && new Date(row.expires_at) < new Date()) return { status: "expired" };

  const { data: itemRows, error: itemsError } = await supabase
    .from("wishlist_items")
    .select("id, name, note, price_naira, link, claimed_by")
    .eq("wishlist_id", row.id)
    .order("created_at", { ascending: true });

  if (itemsError) throw new Error("Failed to load wishlist items");

  const items: GiverItem[] = ((itemRows ?? []) as ItemRow[]).map((i) => ({
    id: i.id,
    name: i.name,
    note: i.note,
    priceNaira: i.price_naira,
    link: i.link,
    claimedBy: i.claimed_by,
  }));

  return {
    status: "found",
    manageTokenHash: row.manage_token_hash,
    items,
    wishlist: { internalId: row.id, publicId: row.public_id, ownerName: row.owner_name, title: row.title },
  };
}