import { DETAIL_SUFFIX, TEMPLATES } from "./templates";
import type { VibeId } from "./vibes";

export const FREE_REGEN_LIMIT = 3;

type GenerateInput = {
  vibe: VibeId;
  recipientName: string;
  personalDetail?: string | null;
};

// Function replacers avoid special "$" patterns in user-supplied text.
function build(template: string, { vibe, recipientName, personalDetail }: GenerateInput): string {
  const base = template.replaceAll("{name}", () => recipientName);
  if (!personalDetail) return base;
  return `${base} ${DETAIL_SUFFIX[vibe].replaceAll("{detail}", () => personalDetail)}`;
}

/** Picks a random template for the vibe, avoiding `avoid` (the current message). */
export function generateSantaMessage(input: GenerateInput, avoid?: string): string {
  const all = TEMPLATES[input.vibe].map((t) => build(t, input));
  const options = all.filter((m) => m !== avoid);
  const pool = options.length > 0 ? options : all;
  return pool[Math.floor(Math.random() * pool.length)];
}