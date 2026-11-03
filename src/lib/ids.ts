import "server-only";
import { randomBytes, createHash } from "node:crypto";

/** 12 URL-safe chars, 72 bits of randomness: not guessable. */
export const generatePublicId = () => randomBytes(9).toString("base64url");
export const generateManageToken = () => randomBytes(24).toString("base64url");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");