import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateManageToken, generatePublicId, hashToken } from "@/lib/ids";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createSurpriseSchema } from "@/features/surprise-creator/schemas";
import { generateSantaMessage } from "@/features/surprise-creator/generator";
import { manageCookieName } from "@/features/surprise-creator/ownership";

export async function POST(req: Request) {
  if (!rateLimit(`create:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Give Santa a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = createSurpriseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const generatedMessage = generateSantaMessage({
    vibe: input.vibe,
    recipientName: input.recipientName,
    personalDetail: input.personalDetail,
  });

  const manageToken = generateManageToken();
  const supabase = createAdminClient();
  let createdId: string | null = null;

  // Retry only on the (astronomically unlikely) public_id collision.
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = generatePublicId();
    const { error } = await supabase.from("surprises").insert({
      public_id: candidate,
      recipient_name: input.recipientName,
      relationship: input.relationship,
      vibe: input.vibe,
      sender_name: input.senderName ?? null,
      personal_detail: input.personalDetail ?? null,
      custom_message: input.customMessage ?? null,
      generated_message: generatedMessage,
      manage_token_hash: hashToken(manageToken),
    });
    if (!error) {
      createdId = candidate;
      break;
    }
    console.error("surprise insert failed", error.code); // never log user input
    if (error.code !== "23505") break;
  }

  if (!createdId) {
    return NextResponse.json({ error: "Couldn't save your surprise. Please try again." }, { status: 500 });
  }

  const res = NextResponse.json({ publicId: createdId }, { status: 201 });
  res.cookies.set(manageCookieName(createdId), manageToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}