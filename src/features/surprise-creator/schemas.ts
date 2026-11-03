import { z } from "zod";
import type { VibeId } from "./vibes";

const VIBE_IDS = ["funny", "savage", "romantic", "wholesome", "mysterious"] as const satisfies readonly VibeId[];
const RELATIONSHIP_IDS = ["friend", "crush", "partner", "sibling", "family", "group_chat"] as const;

/** Trims, and turns empty strings into undefined so optional fields stay clean. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep it under ${max} characters`)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const createSurpriseSchema = z
  .object({
    recipientName: z.string().trim().min(1, "Who is Santa talking to?").max(40, "Keep the name under 40 characters"),
    relationship: z.enum(RELATIONSHIP_IDS),
    vibe: z.enum(VIBE_IDS),
    senderName: optionalText(40),
    personalDetail: optionalText(120),
    customMessage: optionalText(200),
  })
  .refine(
    (d) => !(d.vibe === "romantic" && (d.relationship === "sibling" || d.relationship === "family")),
    { message: "The Romantic style isn't available for siblings or family.", path: ["vibe"] },
  );

export type CreateSurpriseInput = z.infer<typeof createSurpriseSchema>;