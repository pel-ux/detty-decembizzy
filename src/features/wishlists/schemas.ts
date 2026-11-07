import { z } from "zod";

export const MAX_ITEMS_PER_WISHLIST = 20;

const emptyToUndefined = (v: string) => (v === "" ? undefined : v);

const optionalText = (max: number) =>
  z.string().trim().max(max, `Keep it under ${max} characters`).transform(emptyToUndefined).optional();

/** Only http(s) links. Blocks javascript:, data:, etc. */
function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export const createWishlistSchema = z.object({
  ownerName: z.string().trim().min(1, "What should we call you?").max(40, "Keep your name under 40 characters"),
  title: z.string().trim().min(1, "Give your list a title").max(60, "Keep the title under 60 characters"),
});

export const addItemSchema = z.object({
  name: z.string().trim().min(1, "What is the gift?").max(80, "Keep it under 80 characters"),
  note: optionalText(160),
  priceNaira: z.number().int("Use a whole number of naira").min(0).max(100_000_000).optional(),
  link: z
    .string()
    .trim()
    .max(300, "That link is too long")
    .transform(emptyToUndefined)
    .optional()
    .refine((v) => v === undefined || isHttpUrl(v), "Enter a full link starting with https://"),
});

export const removeItemSchema = z.object({ itemId: z.string().uuid() });

export const claimSchema = z.object({
  itemId: z.string().uuid(),
  nickname: z.string().trim().min(1, "Add your name first").max(30, "Keep your name under 30 characters"),
});