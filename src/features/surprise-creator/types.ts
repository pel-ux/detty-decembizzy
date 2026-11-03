import type { VibeId } from "./vibes";

export const RELATIONSHIPS = [
  { id: "friend", label: "Friend" },
  { id: "crush", label: "Crush" },
  { id: "partner", label: "Partner" },
  { id: "sibling", label: "Sibling" },
  { id: "family", label: "Family member" },
  { id: "group_chat", label: "Group chat" },
] as const;

export type RelationshipId = (typeof RELATIONSHIPS)[number]["id"];

export type Surprise = {
  publicId: string;
  recipientName: string;
  relationship: RelationshipId;
  vibe: VibeId;
  senderName: string | null;
  personalDetail: string | null;
  customMessage: string | null;
  generatedMessage: string;
  tier: "free" | "premium";
  regenCount: number;
};