import { z } from "zod";

export const initializeCheckoutSchema = z.object({
  publicId: z.string().regex(/^[A-Za-z0-9_-]{12}$/),
  productCode: z.enum(["premium_surprise", "premium_bundle"]),
  email: z.string().trim().toLowerCase().email().max(254),
});

export const paystackInitSchema = z.object({
  status: z.boolean(),
  data: z.object({
    authorization_url: z.string().url(),
    access_code: z.string(),
    reference: z.string(),
  }),
});

export const paystackVerifySchema = z.object({
  status: z.boolean(),
  data: z.object({
    status: z.string(),
    reference: z.string(),
    amount: z.number().int(),
    currency: z.string(),
  }),
});

export const webhookEventSchema = z.object({
  event: z.string(),
  data: z
    .object({
      id: z.union([z.number(), z.string()]).optional(),
      reference: z.string().optional(),
    })
    .passthrough(),
});