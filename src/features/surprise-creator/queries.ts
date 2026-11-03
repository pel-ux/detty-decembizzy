import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { RelationshipId, Surprise } from "./types";
import type { VibeId } from "./vibes";

const PUBLIC_ID_PATTERN = /^[A-Za-z0-9_-]{12}$/;

const COLUMNS =
  "public_id, recipient_name, relationship, vibe, sender_name, personal_detail, custom_message, generated_message, tier, regen_count, expires_at, manage_token_hash";

type Row = {
  public_id: string;
  recipient_name: string;
  relationship: RelationshipId;
  vibe: VibeId;
  sender_name: string | null;
  personal_detail: string | null;
  custom_message: string | null;
  generated_message: string;
  tier: "free" | "premium";
  regen_count: number;
  expires_at: string | null;
  manage_token_hash: string;
};

export type SurpriseLookup =
  | { status: "found"; surprise: Surprise; manageTokenHash: string }
  | { status: "expired" }
  | { status: "not_found" };

export async function getSurpriseByPublicId(publicId: string): Promise<SurpriseLookup> {
  if (!PUBLIC_ID_PATTERN.test(publicId)) return { status: "not_found" };

  const { data, error } = await createAdminClient()
    .from("surprises")
    .select(COLUMNS)
    .eq("public_id", publicId)
    .maybeSingle<Row>();

  if (error) throw new Error("Failed to load surprise");
  if (!data) return { status: "not_found" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { status: "expired" };

  return {
    status: "found",
    manageTokenHash: data.manage_token_hash,
    surprise: {
      publicId: data.public_id,
      recipientName: data.recipient_name,
      relationship: data.relationship,
      vibe: data.vibe,
      senderName: data.sender_name,
      personalDetail: data.personal_detail,
      customMessage: data.custom_message,
      generatedMessage: data.generated_message,
      tier: data.tier,
      regenCount: data.regen_count,
    },
  };
}