import "server-only";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { hashToken } from "@/lib/ids";

export const manageCookieName = (publicId: string) => `dd_m_${publicId}`;

/** True if the request carries the manage token created with this surprise. */
export async function isOwner(publicId: string, storedHash: string): Promise<boolean> {
  const token = (await cookies()).get(manageCookieName(publicId))?.value;
  if (!token) return false;
  const a = Buffer.from(hashToken(token));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}